import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Brain, Zap, Target, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const AnalisePreditiva = () => {
  const [analise, setAnalise] = useState(null)
  const [processando, setProcessando] = useState(false)

  const executarAnaliseIA = async () => {
    setProcessando(true)
    
    // Simulando processamento de IA avançado
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const resultados = {
      eficienciaAtual: 87.3,
      previsaoEficiencia: 94.1,
      riscos: [
        {
          tipo: 'Sobrecarga de Profissional',
          probabilidade: 78,
          impacto: 'Alto',
          descricao: 'Vany (TO) está com 95% da capacidade utilizada',
          solucao: 'Contratar segundo terapeuta ocupacional'
        },
        {
          tipo: 'Conflito de Horários',
          probabilidade: 65,
          impacto: 'Médio',
          descricao: 'Possível conflito entre psicologia e fisioterapia',
          solucao: 'Redistribuir horários de Ana Luiza'
        },
        {
          tipo: 'Demanda Crescente',
          probabilidade: 89,
          impacto: 'Alto',
          descricao: 'Aumento de 23% na demanda por AT nos próximos 3 meses',
          solucao: 'Expandir equipe de ATs imediatamente'
        }
      ],
      oportunidades: [
        {
          tipo: 'Otimização de Horários',
          potencial: 'Alto',
          descricao: 'Reorganização pode aumentar eficiência em 12%',
          acao: 'Implementar algoritmo de otimização automática'
        },
        {
          tipo: 'Especialização',
          potencial: 'Médio',
          descricao: 'Foco em terapias específicas pode aumentar receita',
          acao: 'Desenvolver programa de especialização'
        }
      ],
      metricas: {
        satisfacaoClientes: 92.5,
        retencaoClientes: 88.7,
        produtividadeProfissionais: 85.3,
        qualidadeAtendimento: 91.2,
        eficienciaOperacional: 87.3,
        inovacaoTecnologica: 76.8
      },
      previsoes: Array.from({ length: 12 }, (_, i) => ({
        mes: `Mês ${i + 1}`,
        eficiencia: 87 + Math.random() * 10,
        demanda: 150 + i * 5 + Math.random() * 20,
        receita: 45000 + i * 2000 + Math.random() * 5000
      })),
      recomendacoes: [
        {
          prioridade: 'Alta',
          categoria: 'Recursos Humanos',
          titulo: 'Expansão da Equipe',
          descricao: 'Contratar 2 ATs e 1 TO para atender demanda crescente',
          impactoEstimado: '+15% eficiência',
          prazo: '30 dias'
        },
        {
          prioridade: 'Média',
          categoria: 'Tecnologia',
          titulo: 'Sistema de Agendamento Inteligente',
          descricao: 'Implementar IA para otimização automática de horários',
          impactoEstimado: '+8% eficiência',
          prazo: '60 dias'
        },
        {
          prioridade: 'Baixa',
          categoria: 'Processos',
          titulo: 'Padronização de Protocolos',
          descricao: 'Criar protocolos padronizados para cada tipo de terapia',
          impactoEstimado: '+5% qualidade',
          prazo: '90 dias'
        }
      ]
    }
    
    setAnalise(resultados)
    setProcessando(false)
  }

  useEffect(() => {
    executarAnaliseIA()
  }, [])

  const cores = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B']

  if (processando) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <Brain className="absolute inset-0 m-auto h-6 w-6 text-indigo-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">IA Processando Dados...</h3>
          <p className="text-gray-600">Analisando padrões e gerando insights</p>
        </div>
      </div>
    )
  }

  if (!analise) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análise Preditiva com IA</h2>
          <p className="text-gray-600">Insights avançados e previsões baseadas em machine learning</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          <Zap className="h-3 w-3 mr-1" />
          Powered by AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Eficiência Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{analise.eficienciaAtual}%</div>
            <div className="text-sm text-gray-600 mt-1">
              Previsão: <span className="font-semibold text-green-600">{analise.previsaoEficiencia}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Riscos Detectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{analise.riscos.length}</div>
            <div className="text-sm text-gray-600 mt-1">Requerem atenção</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analise.oportunidades.length}</div>
            <div className="text-sm text-gray-600 mt-1">Para otimização</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Radar de Performance</CardTitle>
            <CardDescription>Análise multidimensional da operação</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[
                {
                  metrica: 'Satisfação',
                  valor: analise.metricas.satisfacaoClientes,
                  fullMark: 100
                },
                {
                  metrica: 'Retenção',
                  valor: analise.metricas.retencaoClientes,
                  fullMark: 100
                },
                {
                  metrica: 'Produtividade',
                  valor: analise.metricas.produtividadeProfissionais,
                  fullMark: 100
                },
                {
                  metrica: 'Qualidade',
                  valor: analise.metricas.qualidadeAtendimento,
                  fullMark: 100
                },
                {
                  metrica: 'Eficiência',
                  valor: analise.metricas.eficienciaOperacional,
                  fullMark: 100
                },
                {
                  metrica: 'Inovação',
                  valor: analise.metricas.inovacaoTecnologica,
                  fullMark: 100
                }
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metrica" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="valor"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previsões de Tendência</CardTitle>
            <CardDescription>Projeções para os próximos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analise.previsoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="eficiencia" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Eficiência (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="demanda" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  name="Demanda"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Riscos Identificados pela IA</h3>
        {analise.riscos.map((risco, index) => (
          <Alert key={index} variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong>{risco.tipo}</strong>
                  <div className="flex gap-2">
                    <Badge variant="destructive">{risco.probabilidade}% probabilidade</Badge>
                    <Badge variant="outline">{risco.impacto} impacto</Badge>
                  </div>
                </div>
                <p>{risco.descricao}</p>
                <p className="text-sm"><strong>Solução recomendada:</strong> {risco.solucao}</p>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recomendações Estratégicas</h3>
        {analise.recomendacoes.map((rec, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={rec.prioridade === 'Alta' ? 'destructive' : rec.prioridade === 'Média' ? 'default' : 'secondary'}>
                      {rec.prioridade} Prioridade
                    </Badge>
                    <Badge variant="outline">{rec.categoria}</Badge>
                  </div>
                  <h4 className="font-semibold">{rec.titulo}</h4>
                  <p className="text-gray-600">{rec.descricao}</p>
                  <div className="flex gap-4 text-sm">
                    <span><strong>Impacto:</strong> {rec.impactoEstimado}</span>
                    <span><strong>Prazo:</strong> {rec.prazo}</span>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={executarAnaliseIA} disabled={processando} size="lg">
          <Brain className="h-4 w-4 mr-2" />
          Executar Nova Análise IA
        </Button>
      </div>
    </div>
  )
}

export default AnalisePreditiva

