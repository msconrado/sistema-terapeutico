import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const DashboardFinanceiro = () => {
  const [dadosFinanceiros, setDadosFinanceiros] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null)

  const buscarDadosFinanceiros = async () => {
    setCarregando(true)
    try {
      // Simulando dados financeiros em tempo real
      const agora = new Date()
      const dados = {
        receita: {
          valor: 45000 + Math.random() * 10000,
          variacao: (Math.random() - 0.5) * 20,
          historico: Array.from({ length: 30 }, (_, i) => ({
            dia: i + 1,
            valor: 40000 + Math.random() * 15000
          }))
        },
        custos: {
          valor: 28000 + Math.random() * 5000,
          variacao: (Math.random() - 0.5) * 15,
          historico: Array.from({ length: 30 }, (_, i) => ({
            dia: i + 1,
            valor: 25000 + Math.random() * 8000
          }))
        },
        lucro: {
          valor: 17000 + Math.random() * 8000,
          variacao: (Math.random() - 0.5) * 25
        },
        atendimentos: {
          total: 156 + Math.floor(Math.random() * 50),
          variacao: (Math.random() - 0.5) * 30,
          porTipo: {
            fisioterapia: 45 + Math.floor(Math.random() * 20),
            psicologia: 38 + Math.floor(Math.random() * 15),
            terapiaOcupacional: 32 + Math.floor(Math.random() * 12),
            psicopedagogia: 25 + Math.floor(Math.random() * 10),
            at: 16 + Math.floor(Math.random() * 8)
          }
        },
        previsao: {
          proximoMes: 52000 + Math.random() * 12000,
          confianca: 85 + Math.random() * 10
        }
      }
      
      setDadosFinanceiros(dados)
      setUltimaAtualizacao(agora)
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarDadosFinanceiros()
    const intervalo = setInterval(buscarDadosFinanceiros, 30000) // Atualiza a cada 30 segundos
    return () => clearInterval(intervalo)
  }, [])

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarVariacao = (variacao) => {
    const sinal = variacao >= 0 ? '+' : ''
    return `${sinal}${variacao.toFixed(1)}%`
  }

  if (!dadosFinanceiros) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Financeiro</h2>
          <p className="text-gray-600">Análise em tempo real da performance financeira</p>
        </div>
        <div className="flex items-center gap-3">
          {ultimaAtualizacao && (
            <span className="text-sm text-gray-500">
              Última atualização: {ultimaAtualizacao.toLocaleTimeString()}
            </span>
          )}
          <Button 
            onClick={buscarDadosFinanceiros} 
            disabled={carregando}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${carregando ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(dadosFinanceiros.receita.valor)}</div>
            <div className="flex items-center gap-1 text-xs">
              {dadosFinanceiros.receita.variacao >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={dadosFinanceiros.receita.variacao >= 0 ? 'text-green-500' : 'text-red-500'}>
                {formatarVariacao(dadosFinanceiros.receita.variacao)}
              </span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custos Operacionais</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(dadosFinanceiros.custos.valor)}</div>
            <div className="flex items-center gap-1 text-xs">
              {dadosFinanceiros.custos.variacao >= 0 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
              <span className={dadosFinanceiros.custos.variacao >= 0 ? 'text-red-500' : 'text-green-500'}>
                {formatarVariacao(dadosFinanceiros.custos.variacao)}
              </span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(dadosFinanceiros.lucro.valor)}</div>
            <div className="flex items-center gap-1 text-xs">
              {dadosFinanceiros.lucro.variacao >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={dadosFinanceiros.lucro.variacao >= 0 ? 'text-green-500' : 'text-red-500'}>
                {formatarVariacao(dadosFinanceiros.lucro.variacao)}
              </span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Atendimentos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosFinanceiros.atendimentos.total}</div>
            <div className="flex items-center gap-1 text-xs">
              {dadosFinanceiros.atendimentos.variacao >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={dadosFinanceiros.atendimentos.variacao >= 0 ? 'text-green-500' : 'text-red-500'}>
                {formatarVariacao(dadosFinanceiros.atendimentos.variacao)}
              </span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita (30 dias)</CardTitle>
            <CardDescription>Tendência de receita diária</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosFinanceiros.receita.historico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [formatarMoeda(value), 'Receita']} />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previsão IA para Próximo Mês</CardTitle>
            <CardDescription>Análise preditiva baseada em machine learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Receita Prevista:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatarMoeda(dadosFinanceiros.previsao.proximoMes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confiança do Modelo:</span>
                <Badge variant="default">
                  {dadosFinanceiros.previsao.confianca.toFixed(1)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Distribuição por Tipo:</div>
                {Object.entries(dadosFinanceiros.atendimentos.porTipo).map(([tipo, quantidade]) => (
                  <div key={tipo} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{tipo.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium">{quantidade} atendimentos</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardFinanceiro

