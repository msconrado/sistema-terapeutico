import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Calendar, Clock, Users, Brain, Activity, AlertTriangle, CheckCircle, BarChart3, Settings, Zap, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import DashboardFinanceiro from './components/DashboardFinanceiro.jsx';
import AnalisePreditiva from './components/AnalisePreditiva.jsx';
import GradeEditavel from './components/GradeEditavel.jsx';
import ConfiguracoesSistema from './components/ConfiguracoesSistema.jsx';
import './App.css';

// Dados dos profissionais e suas disponibilidades
const profissionais = {
    terapiaOcupacional: {
        nome: 'Vany',
        disponibilidade: {
            segunda: ['08:00', '09:00', '10:00', '11:00'],
            terca: ['08:00', '09:00', '10:00', '11:00'],
            quarta: ['08:00', '09:00', '10:00', '11:00'],
            quinta: ['08:00', '09:00', '10:00', '11:00'],
            sexta: ['08:00', '09:00', '10:00', '11:00'],
        },
        cor: '#8B5CF6',
    },
    psicopedagoga: {
        nome: 'Tatiana',
        disponibilidade: {
            segunda: ['08:00', '09:00', '10:00', '11:00'],
            terca: ['08:00', '09:00', '10:00', '11:00'],
            quarta: ['08:00', '09:00', '10:00', '11:00'],
            quinta: ['08:00', '09:00', '10:00', '11:00'],
            sexta: ['08:00', '09:00', '10:00', '11:00'],
        },
        cor: '#06B6D4',
    },
    fisioterapeuta: {
        nome: 'Mylena',
        disponibilidade: {
            segunda: ['08:00', '09:00', '10:00', '11:00'],
            terca: [],
            quarta: [],
            quinta: ['08:00', '09:00', '10:00', '11:00'],
            sexta: ['08:00', '09:00', '10:00', '11:00'],
        },
        cor: '#10B981',
    },
    at1: {
        nome: 'Vitória',
        disponibilidade: {
            segunda: ['08:00', '09:00', '10:00', '11:00'],
            terca: [],
            quarta: [],
            quinta: ['08:00', '09:00', '10:00', '11:00'],
            sexta: ['08:00', '09:00', '10:00', '11:00'],
        },
        cor: '#F59E0B',
    },
    psicologa1: {
        nome: 'Ana Luiza',
        disponibilidade: {
            segunda: ['09:00', '10:00', '11:00'],
            terca: [],
            quarta: ['09:00', '10:00', '11:00'],
            quinta: ['09:00', '11:00'],
            sexta: [],
        },
        cor: '#EF4444',
    },
};

// Necessidades por criança
const necessidades = {
    henrique: {
        fisioterapia: 1,
        terapiaOcupacional: 2,
        psicopedagogia: 2,
        psicologia: 2,
        at: 9,
    },
    thiago: {
        fisioterapia: 1,
        terapiaOcupacional: 2,
        psicopedagogia: 2,
        psicologia: 2,
        at: 9,
    },
};

function App() {
    // Função para carregar dados do localStorage
    const carregarDados = (chave, valorPadrao) => {
        try {
            const dados = localStorage.getItem(chave);
            return dados ? JSON.parse(dados) : valorPadrao;
        } catch (error) {
            console.error(`Erro ao carregar ${chave}:`, error);
            return valorPadrao;
        }
    };

    // Função para salvar dados no localStorage
    const salvarDados = (chave, dados) => {
        try {
            localStorage.setItem(chave, JSON.stringify(dados));
        } catch (error) {
            console.error(`Erro ao salvar ${chave}:`, error);
        }
    };

    const [gradeOtimizada, setGradeOtimizada] = useState(() => carregarDados('gradeOtimizada', null));
    const [analiseConflitos, setAnaliseConflitos] = useState(null);
    const [metricas, setMetricas] = useState(null);
    const [activeTab, setActiveTab] = useState('otimizacao');

    // Estados editáveis para profissionais e necessidades com persistência
    const [profissionaisEditaveis, setProfissionaisEditaveis] = useState(() => carregarDados('profissionaisEditaveis', profissionais));
    const [necessidadesEditaveis, setNecessidadesEditaveis] = useState(() => carregarDados('necessidadesEditaveis', necessidades));

    // Salvar dados automaticamente quando houver mudanças
    useEffect(() => {
        if (gradeOtimizada) {
            salvarDados('gradeOtimizada', gradeOtimizada);
        }
    }, [gradeOtimizada]);

    useEffect(() => {
        salvarDados('profissionaisEditaveis', profissionaisEditaveis);
    }, [profissionaisEditaveis]);

    useEffect(() => {
        salvarDados('necessidadesEditaveis', necessidadesEditaveis);
    }, [necessidadesEditaveis]);

    // Algoritmo de otimização automática
    const otimizarGrade = () => {
        const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
        const horarios = ['08:00', '09:00', '10:00', '11:00'];
        const grade = {};
        const conflitos = [];
        const estatisticas = {
            atendimentosAlocados: 0,
            atendimentosNecessarios: 0,
            eficiencia: 0,
            conflitosDetectados: 0,
        };

        // Inicializar grade
        dias.forEach((dia) => {
            grade[dia] = {};
            horarios.forEach((horario) => {
                grade[dia][horario] = { henrique: [], thiago: [] };
            });
        });

        // Calcular total de atendimentos necessários
        Object.values(necessidadesEditaveis).forEach((crianca) => {
            Object.values(crianca).forEach((qtd) => {
                estatisticas.atendimentosNecessarios += qtd;
            });
        });

        // Algoritmo de alocação inteligente
        const alocarAtendimento = (tipo, profissional, crianca, quantidade) => {
            let alocados = 0;
            const disponibilidade = profissionaisEditaveis[profissional].disponibilidade;

            dias.forEach((dia) => {
                if (alocados >= quantidade) return;

                disponibilidade[dia].forEach((horario) => {
                    if (alocados >= quantidade) return;

                    // Verificar se há espaço (máximo 2 atendimentos por slot)
                    if (grade[dia][horario][crianca].length < 2) {
                        grade[dia][horario][crianca].push({
                            tipo,
                            profissional: profissionaisEditaveis[profissional].nome,
                            cor: profissionaisEditaveis[profissional].cor,
                        });
                        alocados++;
                        estatisticas.atendimentosAlocados++;
                    }
                });
            });

            if (alocados < quantidade) {
                conflitos.push({
                    tipo: 'falta_horario',
                    atendimento: tipo,
                    profissional: profissionaisEditaveis[profissional].nome,
                    crianca,
                    necessario: quantidade,
                    alocado: alocados,
                    faltante: quantidade - alocados,
                });
                estatisticas.conflitosDetectados++;
            }
        };

        // Alocar atendimentos por prioridade usando dados editáveis
        Object.entries(necessidadesEditaveis).forEach(([crianca, necessidadesCrianca]) => {
            Object.entries(necessidadesCrianca).forEach(([tipo, quantidade]) => {
                if (quantidade > 0) {
                    // Mapear tipos para profissionais
                    const mapeamentoProfissionais = {
                        terapiaOcupacional: 'terapiaOcupacional',
                        psicopedagogia: 'psicopedagoga',
                        fisioterapia: 'fisioterapeuta',
                        psicologia: 'psicologa1',
                        at: 'at1',
                    };

                    const profissionalId = mapeamentoProfissionais[tipo];
                    if (profissionalId && profissionaisEditaveis[profissionalId]) {
                        alocarAtendimento(tipo, profissionalId, crianca, quantidade);
                    }
                }
            });
        });

        // Detectar conflitos de horário
        dias.forEach((dia) => {
            horarios.forEach((horario) => {
                const slot = grade[dia][horario];

                // Verificar conflitos entre profissionais no mesmo horário
                const profissionaisNoHorario = new Set();

                // Verificar atendimentos do Henrique
                slot.henrique.forEach((atendimento) => {
                    if (profissionaisNoHorario.has(atendimento.profissional)) {
                        conflitos.push({
                            tipo: 'conflito_profissional',
                            dia,
                            horario,
                            profissional: atendimento.profissional,
                            descricao: `${atendimento.profissional} tem conflito de horário`,
                        });
                        estatisticas.conflitosDetectados++;
                    }
                    profissionaisNoHorario.add(atendimento.profissional);
                });

                // Verificar atendimentos do Thiago
                slot.thiago.forEach((atendimento) => {
                    if (profissionaisNoHorario.has(atendimento.profissional)) {
                        conflitos.push({
                            tipo: 'conflito_profissional',
                            dia,
                            horario,
                            profissional: atendimento.profissional,
                            descricao: `${atendimento.profissional} não pode atender Henrique e Thiago no mesmo horário`,
                        });
                        estatisticas.conflitosDetectados++;
                    }
                    profissionaisNoHorario.add(atendimento.profissional);
                });
            });
        });

        estatisticas.eficiencia = Math.round((estatisticas.atendimentosAlocados / estatisticas.atendimentosNecessarios) * 100);

        setGradeOtimizada(grade);
        setAnaliseConflitos(conflitos);
        setMetricas(estatisticas);
    };

    // Dados para gráficos
    const dadosGraficos = useMemo(() => {
        if (!gradeOtimizada) return null;

        const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
        const dadosPorDia = dias.map((dia) => {
            const atendimentos = Object.values(gradeOtimizada[dia]).reduce((acc, slot) => {
                if (slot.henrique) acc++;
                if (slot.thiago) acc++;
                return acc;
            }, 0);
            return {
                dia: dia.charAt(0).toUpperCase() + dia.slice(1),
                atendimentos,
            };
        });

        const dadosPorTipo = {};
        Object.values(gradeOtimizada).forEach((dia) => {
            Object.values(dia).forEach((slot) => {
                if (slot.henrique) {
                    dadosPorTipo[slot.henrique.tipo] = (dadosPorTipo[slot.henrique.tipo] || 0) + 1;
                }
                if (slot.thiago) {
                    dadosPorTipo[slot.thiago.tipo] = (dadosPorTipo[slot.thiago.tipo] || 0) + 1;
                }
            });
        });

        const dadosPizza = Object.entries(dadosPorTipo).map(([tipo, quantidade]) => ({
            name: tipo.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
            value: quantidade,
        }));

        return { dadosPorDia, dadosPizza };
    }, [gradeOtimizada]);

    useEffect(() => {
        otimizarGrade();
    }, [profissionaisEditaveis, necessidadesEditaveis]);

    const cores = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Brain className="h-10 w-10 text-indigo-600" />
                        <h1 className="text-4xl font-bold text-gray-900">Sistema Terapêutico</h1>
                        <Zap className="h-8 w-8 text-yellow-500" />
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Otimização automática de grades terapêuticas com IA, análise de conflitos em tempo real e visualizações avançadas
                    </p>
                    <Badge variant="secondary" className="mt-2">
                        🚀
                    </Badge>
                </header>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="otimizacao" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Otimização
                        </TabsTrigger>
                        <TabsTrigger value="grade" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Grade Editável
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="conflitos" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Conflitos
                        </TabsTrigger>
                        <TabsTrigger value="financeiro" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Financeiro
                        </TabsTrigger>
                        <TabsTrigger value="ia_preditiva" className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            IA Preditiva
                        </TabsTrigger>
                        <TabsTrigger value="configuracoes" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Configurações
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="otimizacao" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Métricas Gerais
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {metricas && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>Eficiência:</span>
                                                <Badge variant={metricas.eficiencia > 80 ? 'default' : 'destructive'}>{metricas.eficiencia}%</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Alocados:</span>
                                                <span className="font-semibold">{metricas.atendimentosAlocados}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Necessários:</span>
                                                <span className="font-semibold">{metricas.atendimentosNecessarios}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Conflitos:</span>
                                                <Badge variant={metricas.conflitosDetectados > 0 ? 'destructive' : 'default'}>
                                                    {metricas.conflitosDetectados}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Profissionais
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.entries(profissionaisEditaveis).map(([key, prof]) => (
                                            <div key={key} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prof.cor }}></div>
                                                <span className="text-sm">{prof.nome}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        Ações
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Button onClick={otimizarGrade} className="w-full">
                                            🔄 Reotimizar Grade
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            🖨️ Imprimir Grade
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="grade" className="space-y-6">
                        <GradeEditavel gradeInicial={gradeOtimizada} profissionais={profissionaisEditaveis} onGradeChange={setGradeOtimizada} />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        {dadosGraficos && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Atendimentos por Dia</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={dadosGraficos.dadosPorDia}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="dia" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="atendimentos" fill="#8B5CF6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Distribuição por Tipo</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={dadosGraficos.dadosPizza}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value">
                                                    {dadosGraficos.dadosPizza.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="conflitos" className="space-y-6">
                        {analiseConflitos && (
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5" />
                                            Análise de Conflitos
                                        </CardTitle>
                                        <CardDescription>
                                            {analiseConflitos.length === 0
                                                ? 'Nenhum conflito detectado na grade atual'
                                                : `${analiseConflitos.length} conflito(s) detectado(s)`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {analiseConflitos.length === 0 ? (
                                            <Alert>
                                                <CheckCircle className="h-4 w-4" />
                                                <AlertDescription>Parabéns! A grade está otimizada sem conflitos.</AlertDescription>
                                            </Alert>
                                        ) : (
                                            analiseConflitos.map((conflito, index) => (
                                                <Alert key={index} variant="destructive" className="mb-2">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        <strong>
                                                            {conflito.tipo === 'falta_horario' ? 'Falta de Horário' : 'Conflito de Profissional'}:
                                                        </strong>
                                                        {conflito.tipo === 'falta_horario' ? (
                                                            <span>
                                                                {' '}
                                                                {conflito.profissional} - {conflito.crianca}: Necessário {conflito.necessario},
                                                                alocado {conflito.alocado}, faltante {conflito.faltante}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {' '}
                                                                {conflito.descricao} ({conflito.dia} às {conflito.horario})
                                                            </span>
                                                        )}
                                                    </AlertDescription>
                                                </Alert>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="financeiro" className="space-y-6">
                        <DashboardFinanceiro />
                    </TabsContent>

                    <TabsContent value="ia_preditiva" className="space-y-6">
                        <AnalisePreditiva />
                    </TabsContent>

                    <TabsContent value="configuracoes" className="space-y-6">
                        <ConfiguracoesSistema
                            profissionais={profissionaisEditaveis}
                            necessidades={necessidadesEditaveis}
                            onProfissionaisChange={setProfissionaisEditaveis}
                            onNecessidadesChange={setNecessidadesEditaveis}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default App;
