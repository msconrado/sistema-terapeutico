import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Calendar, Clock, Users, Edit3, Save, X, Trash2, Move } from 'lucide-react'

const GradeEditavel = ({ gradeInicial, profissionais, onGradeChange }) => {
  // Função para carregar dados do localStorage
  const carregarDados = (chave, valorPadrao) => {
    try {
      const dados = localStorage.getItem(chave)
      return dados ? JSON.parse(dados) : valorPadrao
    } catch (error) {
      console.error(`Erro ao carregar ${chave}:`, error)
      return valorPadrao
    }
  }

  // Função para salvar dados no localStorage
  const salvarDados = (chave, dados) => {
    try {
      localStorage.setItem(chave, JSON.stringify(dados))
    } catch (error) {
      console.error(`Erro ao salvar ${chave}:`, error)
    }
  }

  const [grade, setGrade] = useState(() => 
    carregarDados('gradeEditavel', gradeInicial || {})
  )
  const [modoEdicao, setModoEdicao] = useState(false)
  const [slotEditando, setSlotEditando] = useState(null)
  const [itemArrastando, setItemArrastando] = useState(null)
  const [slotDestaque, setSlotDestaque] = useState(null)

  // Salvar grade automaticamente quando houver mudanças
  useEffect(() => {
    salvarDados('gradeEditavel', grade)
    if (onGradeChange) {
      onGradeChange(grade)
    }
  }, [grade, onGradeChange])

  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
  const horarios = ['08:00', '09:00', '10:00', '11:00']
  const criancas = ['henrique', 'thiago']

  const tiposAtendimento = {
    fisioterapia: { nome: 'Fisioterapia', cor: '#10B981' },
    terapiaOcupacional: { nome: 'Terapia Ocupacional', cor: '#8B5CF6' },
    psicopedagogia: { nome: 'Psicopedagogia', cor: '#06B6D4' },
    psicologia: { nome: 'Psicologia', cor: '#EF4444' },
    at: { nome: 'AT', cor: '#F59E0B' }
  }

  useEffect(() => {
    // Só atualiza a grade se não houver dados salvos e gradeInicial existir
    const dadosSalvos = carregarDados('gradeEditavel', null)
    if (!dadosSalvos && gradeInicial) {
      setGrade(gradeInicial)
    }
  }, [gradeInicial])

  const limparGrade = () => {
    const novaGrade = {}
    dias.forEach(dia => {
      novaGrade[dia] = {}
      horarios.forEach(horario => {
        novaGrade[dia][horario] = { 
          henrique: [], // Array para múltiplos atendimentos
          thiago: []    // Array para múltiplos atendimentos
        }
      })
    })
    setGrade(novaGrade)
  }

  const salvarGrade = () => {
    if (onGradeChange) {
      onGradeChange(grade)
    }
    setModoEdicao(false)
    setSlotEditando(null)
  }

  const cancelarEdicao = () => {
    setGrade(gradeInicial || {})
    setModoEdicao(false)
    setSlotEditando(null)
  }

  // Funções de Drag and Drop
  const handleDragStart = (e, dia, horario, crianca, index) => {
    const atendimento = grade[dia]?.[horario]?.[crianca]?.[index]
    if (atendimento) {
      const dragData = {
        dia,
        horario,
        crianca,
        index, // Adiciona o índice do atendimento
        atendimento
      }
      setItemArrastando(dragData)
      e.dataTransfer.setData("text/plain", JSON.stringify(dragData))
      e.dataTransfer.effectAllowed = "move"
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e, dia, horario, crianca) => {
    e.preventDefault()
    if (itemArrastando) {
      setSlotDestaque(`${dia}-${horario}-${crianca}`)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setSlotDestaque(null)
  }

  const handleDrop = (e, diaDestino, horarioDestino, criancaDestino) => {
    e.preventDefault()
    setSlotDestaque(null)

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("text/plain"))
      
      if (dragData && itemArrastando) {
        const novaGrade = { ...grade }
        
        // Remove do slot original
        if (novaGrade[dragData.dia] && novaGrade[dragData.dia][dragData.horario] && novaGrade[dragData.dia][dragData.horario][dragData.crianca]) {
          novaGrade[dragData.dia][dragData.horario][dragData.crianca].splice(dragData.index, 1)
        }
        
        // Adiciona no slot destino
        if (!novaGrade[diaDestino]) {
          novaGrade[diaDestino] = {}
        }
        if (!novaGrade[diaDestino][horarioDestino]) {
          novaGrade[diaDestino][horarioDestino] = { henrique: [], thiago: [] }
        }
        
        // Verificar limite de 2 atendimentos no destino
        if (novaGrade[diaDestino][horarioDestino][criancaDestino].length >= 2) {
          alert("Máximo de 2 atendimentos simultâneos por horário no destino!")
          return
        }

        novaGrade[diaDestino][horarioDestino][criancaDestino].push(dragData.atendimento)
        setGrade(novaGrade)
        setItemArrastando(null)
      }
    } catch (error) {
      console.error("Erro ao processar drop:", error)
      setItemArrastando(null)
    }
  }

  const SlotEditor = ({ dia, horario, crianca, atendimentos = [], onClose, onSave, onDelete }) => {
    const [tipoSelecionado, setTipoSelecionado] = useState('')
    const [profissionalSelecionado, setProfissionalSelecionado] = useState('')

    const profissionaisDisponiveis = Object.values(profissionais || {})

    const handleSave = () => {
      if (tipoSelecionado && profissionalSelecionado) {
        const profissionalObj = profissionaisDisponiveis.find(p => p.nome === profissionalSelecionado)
        const novoAtendimento = {
          tipo: tipoSelecionado,
          profissional: profissionalSelecionado,
          cor: profissionalObj?.cor || tiposAtendimento[tipoSelecionado]?.cor || '#8B5CF6'
        }
        onSave(novoAtendimento)
        setTipoSelecionado('')
        setProfissionalSelecionado('')
      }
    }

    const handleDelete = (index) => {
      onDelete(index)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            Gerenciar Atendimentos - {crianca.charAt(0).toUpperCase() + crianca.slice(1)}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{dia} às {horario}</p>
          
          {/* Lista de atendimentos existentes */}
          {atendimentos.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Atendimentos Agendados:</h4>
              <div className="space-y-2">
                {atendimentos.map((atendimento, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: atendimento.cor }}
                      ></div>
                      <span className="text-sm">
                        {tiposAtendimento[atendimento.tipo]?.nome} - {atendimento.profissional}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remover atendimento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Formulário para adicionar novo atendimento */}
          {atendimentos.length < 2 && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Adicionar Novo Atendimento:</h4>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Atendimento</label>
                <select
                  value={tipoSelecionado}
                  onChange={(e) => setTipoSelecionado(e.target.value)}
                  className="w-full p-2 border rounded-md focus:border-blue-500 outline-none"
                >
                  <option value="">Selecione o tipo</option>
                  {Object.entries(tiposAtendimento).map(([key, tipo]) => (
                    <option key={key} value={key}>{tipo.nome}</option>
                  ))}
                </select>
              </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profissional</label>
              <select
                value={profissionalSelecionado}
                onChange={(e) => setProfissionalSelecionado(e.target.value)}
                className="w-full p-2 border rounded-md focus:border-blue-500 outline-none"
              >
                <option value="">Selecione o profissional</option>
                {profissionaisDisponiveis.map((prof, index) => (
                  <option key={index} value={prof.nome}>{prof.nome}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!tipoSelecionado || !profissionalSelecionado}>
                Adicionar Atendimento
              </Button>
            </div>
          </div>
          )}

          <div className="flex gap-2 mt-6 justify-end">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const editarSlot = (dia, horario, crianca) => {
    if (!modoEdicao) return
    setSlotEditando({ dia, horario, crianca })
  }

  const salvarAtendimento = (novoAtendimento) => {
    if (!slotEditando) return
    
    const { dia, horario, crianca } = slotEditando
    const novaGrade = { ...grade }
    
    // Inicializar estrutura se não existir
    if (!novaGrade[dia]) novaGrade[dia] = {}
    if (!novaGrade[dia][horario]) novaGrade[dia][horario] = { henrique: [], thiago: [] }
    if (!novaGrade[dia][horario][crianca]) novaGrade[dia][horario][crianca] = []
    
    // Verificar limite de 2 atendimentos
    if (novaGrade[dia][horario][crianca].length >= 2) {
      alert('Máximo de 2 atendimentos simultâneos por horário!')
      return
    }
    
    // Adicionar novo atendimento
    novaGrade[dia][horario][crianca].push(novoAtendimento)
    setGrade(novaGrade)
  }

  const removerAtendimento = (index) => {
    if (!slotEditando) return
    
    const { dia, horario, crianca } = slotEditando
    const novaGrade = { ...grade }
    
    if (novaGrade[dia] && novaGrade[dia][horario] && novaGrade[dia][horario][crianca]) {
      novaGrade[dia][horario][crianca].splice(index, 1)
      setGrade(novaGrade)
    }
  }

  const renderSlot = (dia, horario, crianca) => {
    const atendimentos = grade[dia]?.[horario]?.[crianca] || []
    const slotId = `${dia}-${horario}-${crianca}`
    const isDestaque = slotDestaque === slotId

    if (atendimentos.length === 0) {
      // Slot vazio
      return (
        <div
          key={slotId}
          className={`h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${isDestaque ? 'border-blue-500 bg-blue-100' : ''}`}
          onClick={() => editarSlot(dia, horario, crianca)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, dia, horario, crianca)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, dia, horario, crianca)}
        >
          {modoEdicao ? 'Clique para adicionar' : 'Vazio'}
        </div>
      )
    }

    // Slot com atendimentos
    return (
      <div
        key={slotId}
        className={`space-y-1 ${isDestaque ? 'ring-2 ring-blue-500 rounded' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, dia, horario, crianca)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, dia, horario, crianca)}
      >
        {atendimentos.map((atendimento, index) => (
          <div
            key={index}
            className={`p-2 rounded text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${modoEdicao ? 'cursor-move' : ''}`}
            style={{ backgroundColor: atendimento.cor }}
            onClick={() => modoEdicao && editarSlot(dia, horario, crianca)}
            draggable={modoEdicao}
            onDragStart={(e) => handleDragStart(e, dia, horario, crianca, index)}
          >
            <div className="flex items-center gap-1">
              {modoEdicao && <Move className="h-3 w-3" />}
              <div>
                <div className="font-semibold">{atendimento.profissional}</div>
                <div className="text-xs opacity-90">{tiposAtendimento[atendimento.tipo]?.nome}</div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Botão para adicionar mais atendimentos se houver espaço */}
        {modoEdicao && atendimentos.length < 2 && (
          <div
            className="h-8 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-xs text-gray-600 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            onClick={() => editarSlot(dia, horario, crianca)}
          >
            + Adicionar
          </div>
        )}
      </div>
    )
  }

  if (!grade || Object.keys(grade).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grade de Atendimentos</CardTitle>
          <CardDescription>Nenhuma grade disponível. Execute a otimização primeiro.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grade de Atendimentos Editável</h2>
          <p className="text-gray-600">
            {modoEdicao 
              ? 'Clique nos slots para editar ou arraste os atendimentos para reorganizar' 
              : 'Visualização da grade de atendimentos otimizada'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!modoEdicao ? (
            <Button onClick={() => setModoEdicao(true)} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Grade
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={cancelarEdicao} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              
              <Button onClick={limparGrade} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar
              </Button>
              
              <Button onClick={salvarGrade}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </div>

      {modoEdicao && (
        <Alert>
          <Move className="h-4 w-4" />
          <AlertDescription>
            Modo de edição ativo. Clique nos slots para editar ou arraste os atendimentos para reorganizar a grade.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50 text-left font-semibold">Horário</th>
                  {dias.map(dia => (
                    <th key={dia} className="border p-2 bg-gray-50 text-center font-semibold" colSpan={2}>
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="border p-2 bg-gray-100"></th>
                  {dias.map(dia => (
                    <React.Fragment key={dia}>
                      <th className="border p-2 bg-gray-100 text-xs font-medium text-center">Henrique</th>
                      <th className="border p-2 bg-gray-100 text-xs font-medium text-center">Thiago</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horarios.map(horario => (
                  <tr key={horario}>
                    <td className="border p-2 bg-gray-50 font-medium text-center">
                      {horario}
                    </td>
                    {dias.map(dia => (
                      <React.Fragment key={dia}>
                        <td className="border p-1">
                          {renderSlot(dia, horario, 'henrique')}
                        </td>
                        <td className="border p-1">
                          {renderSlot(dia, horario, 'thiago')}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {slotEditando && (
        <SlotEditor
          dia={slotEditando.dia}
          horario={slotEditando.horario}
          crianca={slotEditando.crianca}
          atendimentos={grade[slotEditando.dia]?.[slotEditando.horario]?.[slotEditando.crianca] || []}
          onClose={() => setSlotEditando(null)}
          onSave={salvarAtendimento}
          onDelete={removerAtendimento}
        />
      )}
    </div>
  )
}

export default GradeEditavel

