import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Settings, Save, X, Plus, Trash2, Edit3, CheckCircle, Users, Calendar, Palette } from 'lucide-react'

const ConfiguracoesSistema = ({ profissionais, necessidades, onProfissionaisChange, onNecessidadesChange }) => {
  const [profissionaisEditaveis, setProfissionaisEditaveis] = useState(profissionais || {})
  const [necessidadesEditaveis, setNecessidadesEditaveis] = useState(necessidades || {})
  const [modoEdicao, setModoEdicao] = useState(false)
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false)
  const [novoProfissional, setNovoProfissional] = useState({
    nome: '',
    especialidade: '',
    cor: '#8B5CF6'
  })
  const [mostrarFormularioNovo, setMostrarFormularioNovo] = useState(false)

  const tiposAtendimento = {
    fisioterapia: { nome: 'Fisioterapia', cor: '#10B981' },
    terapiaOcupacional: { nome: 'Terapia Ocupacional', cor: '#8B5CF6' },
    psicopedagogia: { nome: 'Psicopedagogia', cor: '#06B6D4' },
    psicologia: { nome: 'Psicologia', cor: '#EF4444' },
    at: { nome: 'AT', cor: '#F59E0B' }
  }

  const coresPredefinidas = [
    '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
    '#EC4899', '#8B5A2B', '#6366F1', '#84CC16', '#F97316'
  ]

  const criancas = ['henrique', 'thiago']

  useEffect(() => {
    setProfissionaisEditaveis(profissionais || {})
    setNecessidadesEditaveis(necessidades || {})
  }, [profissionais, necessidades])

  const atualizarNomeProfissional = (id, novoNome) => {
    const novosProfissionais = {
      ...profissionaisEditaveis,
      [id]: {
        ...profissionaisEditaveis[id],
        nome: novoNome
      }
    }
    setProfissionaisEditaveis(novosProfissionais)
    setAlteracoesPendentes(true)
  }

  const atualizarCorProfissional = (id, novaCor) => {
    const novosProfissionais = {
      ...profissionaisEditaveis,
      [id]: {
        ...profissionaisEditaveis[id],
        cor: novaCor
      }
    }
    setProfissionaisEditaveis(novosProfissionais)
    setAlteracoesPendentes(true)
  }

  const removerProfissional = (id) => {
    const novosProfissionais = { ...profissionaisEditaveis }
    delete novosProfissionais[id]
    setProfissionaisEditaveis(novosProfissionais)
    setAlteracoesPendentes(true)
  }

  const adicionarNovoProfissional = () => {
    if (!novoProfissional.nome || !novoProfissional.especialidade) {
      alert('Por favor, preencha nome e especialidade')
      return
    }

    const id = novoProfissional.especialidade.toLowerCase().replace(/\s+/g, '') + Date.now()
    const novosProfissionais = {
      ...profissionaisEditaveis,
      [id]: {
        nome: novoProfissional.nome,
        cor: novoProfissional.cor,
        disponibilidade: {
          segunda: ["08:00", "09:00", "10:00", "11:00"],
          terca: ["08:00", "09:00", "10:00", "11:00"],
          quarta: ["08:00", "09:00", "10:00", "11:00"],
          quinta: ["08:00", "09:00", "10:00", "11:00"],
          sexta: ["08:00", "09:00", "10:00", "11:00"]
        }
      }
    }

    setProfissionaisEditaveis(novosProfissionais)
    setNovoProfissional({ nome: '', especialidade: '', cor: '#8B5CF6' })
    setMostrarFormularioNovo(false)
    setAlteracoesPendentes(true)
  }

  const atualizarQuantidadeNecessidade = (crianca, tipo, quantidade) => {
    const novasNecessidades = {
      ...necessidadesEditaveis,
      [crianca]: {
        ...necessidadesEditaveis[crianca],
        [tipo]: parseInt(quantidade) || 0
      }
    }
    setNecessidadesEditaveis(novasNecessidades)
    setAlteracoesPendentes(true)
  }

  const salvarAlteracoes = () => {
    if (onProfissionaisChange) {
      onProfissionaisChange(profissionaisEditaveis)
    }
    if (onNecessidadesChange) {
      onNecessidadesChange(necessidadesEditaveis)
    }
    setAlteracoesPendentes(false)
    setModoEdicao(false)
    setMostrarFormularioNovo(false)
  }

  const cancelarEdicao = () => {
    setProfissionaisEditaveis(profissionais || {})
    setNecessidadesEditaveis(necessidades || {})
    setAlteracoesPendentes(false)
    setModoEdicao(false)
    setMostrarFormularioNovo(false)
    setNovoProfissional({ nome: '', especialidade: '', cor: '#8B5CF6' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
          <p className="text-gray-600">Edite os nomes dos profissionais, adicione novos e ajuste quantidades de terapias</p>
        </div>
        
        <div className="flex items-center gap-2">
          {alteracoesPendentes && (
            <Badge variant="secondary" className="animate-pulse">
              Alterações pendentes
            </Badge>
          )}
          
          {!modoEdicao ? (
            <Button onClick={() => setModoEdicao(true)} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Configurações
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={cancelarEdicao} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              
              <Button onClick={salvarAlteracoes} disabled={!alteracoesPendentes}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </div>

      {modoEdicao && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Modo de edição ativo. Modifique os nomes dos profissionais, cores, quantidades de terapias e adicione novos profissionais conforme necessário.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração de Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Profissionais
              {modoEdicao && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setMostrarFormularioNovo(!mostrarFormularioNovo)}
                  className="ml-auto"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {modoEdicao ? 'Edite os nomes, cores dos profissionais ou adicione novos' : 'Lista dos profissionais cadastrados'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Formulário para novo profissional */}
              {modoEdicao && mostrarFormularioNovo && (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Novo Profissional</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Nome do profissional"
                      value={novoProfissional.nome}
                      onChange={(e) => setNovoProfissional({...novoProfissional, nome: e.target.value})}
                      className="px-3 py-2 border rounded-md focus:border-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Especialidade (ex: Fonoaudiologia)"
                      value={novoProfissional.especialidade}
                      onChange={(e) => setNovoProfissional({...novoProfissional, especialidade: e.target.value})}
                      className="px-3 py-2 border rounded-md focus:border-blue-500 outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Cor:</span>
                      <div className="flex gap-1">
                        {coresPredefinidas.map(cor => (
                          <button
                            key={cor}
                            onClick={() => setNovoProfissional({...novoProfissional, cor})}
                            className={`w-6 h-6 rounded-full border-2 ${novoProfissional.cor === cor ? 'border-gray-800' : 'border-gray-300'}`}
                            style={{ backgroundColor: cor }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={adicionarNovoProfissional}>
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setMostrarFormularioNovo(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de profissionais existentes */}
              {Object.entries(profissionaisEditaveis).map(([id, prof]) => (
                <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {modoEdicao ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {coresPredefinidas.map(cor => (
                            <button
                              key={cor}
                              onClick={() => atualizarCorProfissional(id, cor)}
                              className={`w-4 h-4 rounded-full border ${prof.cor === cor ? 'border-gray-800 border-2' : 'border-gray-300'}`}
                              style={{ backgroundColor: cor }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: prof.cor }}
                      ></div>
                    )}
                    {modoEdicao ? (
                      <input
                        type="text"
                        value={prof.nome}
                        onChange={(e) => atualizarNomeProfissional(id, e.target.value)}
                        className="font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1"
                      />
                    ) : (
                      <span className="font-medium">{prof.nome}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Badge>
                    {modoEdicao && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => removerProfissional(id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Necessidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quantidades de Terapias
            </CardTitle>
            <CardDescription>
              {modoEdicao ? 'Ajuste as quantidades necessárias por criança' : 'Quantidades configuradas por criança'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {criancas.map(crianca => (
                <div key={crianca} className="space-y-3">
                  <h4 className="font-semibold text-lg capitalize">{crianca}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(tiposAtendimento).map(([tipo, info]) => (
                      <div key={tipo} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: info.cor }}
                          ></div>
                          <span className="text-sm font-medium">{info.nome}</span>
                        </div>
                        {modoEdicao ? (
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={necessidadesEditaveis[crianca]?.[tipo] || 0}
                            onChange={(e) => atualizarQuantidadeNecessidade(crianca, tipo, e.target.value)}
                            className="w-16 px-2 py-1 text-center border rounded focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <Badge variant="secondary">
                            {necessidadesEditaveis[crianca]?.[tipo] || 0}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo das Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Configurações</CardTitle>
          <CardDescription>
            Visão geral das configurações atuais do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(profissionaisEditaveis).length}
              </div>
              <div className="text-sm text-blue-600">Profissionais</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {criancas.reduce((total, crianca) => 
                  total + Object.values(necessidadesEditaveis[crianca] || {}).reduce((sum, qtd) => sum + qtd, 0), 0
                )}
              </div>
              <div className="text-sm text-green-600">Total de Terapias</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(tiposAtendimento).length}
              </div>
              <div className="text-sm text-purple-600">Tipos de Atendimento</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfiguracoesSistema
