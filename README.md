# EsserePet — versão corrigida

## Como publicar
Suba **todos os arquivos da pasta `publicar/` juntos, na mesma pasta** da sua plataforma, com HTTPS:

| Arquivo | Para quê |
| --- | --- |
| `index.html` | o app (arquivo único, já com fontes, React e design system dentro, sem depender de CDN) |
| `sw.js` | service worker: notificações e abrir o pet certo ao tocar no aviso |
| `manifest.webmanifest`, `icon-192.png`, `icon-512.png` | permitem "Adicionar à Tela de Início" (obrigatório para notificação no iPhone) |
| `folha-exportacao.html` | a folha de exportação (botão "Baixar PDF") |
| `portal-veterinario.html` | o portal do veterinário (link do menu e das Dicas) |

Se a plataforma só aceitar um arquivo, o `index.html` sozinho funciona, mas sem a folha de exportação e com notificações só enquanto a página está aberta.

## O que mudou

**Responsividade**
- O cabeçalho não estoura mais no celular: em telas estreitas o nome some e "Registrar" vira só o botão "+". O menu ☰ volta a aparecer (antes ficava fora da tela e não dava para navegar).
- Os cartões dos pets e das dicas não são mais cortados à direita.
- Campos com fonte de 16 px no celular (o iPhone dava zoom ao tocar em qualquer campo), altura mínima de toque de 44 px, datas e horas alinhadas no iOS.
- Respeita o notch e a barra inferior do iPhone, calcula a altura certa em navegadores antigos e não rola mais na horizontal.

**Campos que estavam quebrados**
- Registrar vacina: "Data de aplicação" e "Próximo reforço" não aceitavam digitação. Agora são calendários e o que você escolhe é o que fica salvo. "Veterinário", "Clínica" e "Observações" eram ignorados ao salvar (sempre gravava "Dra. Camila Reis / Clínica Bicho Bom"). Agora gravam o que foi digitado. O lote não é mais preenchido com um número inventado.
- Criar conta: nome, e-mail e senhas não estavam ligados a nada, e o botão entrava na conta de demonstração do Jonatas. Agora valida tudo e cria uma conta nova de verdade (plano gratuito, sem pets).
- Novo pet: o microchip não era salvo. Agora é.
- Medicamento: "Primeira dose" virou um seletor de horário.
- Datas de nascimento, óbito e aplicação não aceitam mais datas futuras.

**Dados e datas**
- O app usava uma data fixa (07/08/2026 às 14:20) como "hoje". Agora usa a data e a hora reais do aparelho, e o status das vacinas (atrasada, próxima, em dia) é calculado pela data.
- Tudo o que você cadastra fica salvo no aparelho. Antes sumia ao recarregar a página ou ao sair da conta.

**Notificações**
- O app pede permissão quando você liga "Lembretes de vacina" (Privacidade) ou "Aviso no celular a cada dose" (Lembretes), ou toca em "Ativar notificações" na tela Lembretes.
- Quando disparam: remédio no horário de cada dose; vacina 15 dias antes, 3 dias antes, no dia e semanalmente enquanto atrasada; banho e cuidados no dia e enquanto atrasados. Lembretes de vacina e de cuidados nunca chegam antes das 9h. Se houver muitos de uma vez, eles viram um resumo.
- Tocar na notificação abre a caderneta do pet na aba certa.
- O aviso sempre aparece também dentro do app.
- Se o app rodar dentro de outra plataforma (iframe ou webview), cada lembrete também é enviado para a plataforma hospedeira, para ela disparar o push nativo:
  - iframe: `window.parent.postMessage({ tipo: "esserepet:notificacao", titulo, corpo, pet, aba, chave })`
  - React Native: `window.ReactNativeWebView.postMessage(JSON)`
  - iOS WKWebView: `window.webkit.messageHandlers.esserepet.postMessage(...)`
  - Android WebView: `window.EsserePetNativo.notificar(JSON)`

**Atualização (vacina atrasada e push)**
- Ao abrir uma vacina (pela caderneta ou pela tela Lembretes) aparece "Registrar nova dose de …": o formulário já vem com essa vacina, a data de hoje, o próximo reforço calculado e o veterinário e a clínica da última dose. Ao salvar, o atraso some da home, dos Lembretes e a notificação daquela vacina é apagada.
- "Registrar vacina" agora já abre com a vacina mais atrasada do pet (antes abria sempre em V10, e por isso a vacina atrasada continuava atrasada).
- Tela Lembretes: painel "Avisos por push" com Vacinas, Banho e cuidados e Medicamentos; lista de banho e cuidados vencendo com botão "Fiz hoje".
- Banho e cuidados avisam na véspera, no dia e todo dia enquanto atrasados. Remédios avisam 15 minutos antes e no horário. "Fiz hoje" e "Dei a dose" apagam a notificação correspondente.
- Para plataformas hospedeiras, além de `esserepet:notificacao` agora também vai `esserepet:cancelar` (com `prefixos`) para apagar avisos que não valem mais.

**Atualização (tema, cadernetas, remédios)**
- Tema Claro, Escuro ou Auto (segue o celular), no menu ☰ e no Perfil. Corrigido o texto branco em fundo claro que aparecia com o aparelho em modo escuro.
- Menu → Caderneta abre a lista de todos os pets (antes abria direto o primeiro).
- Remédio novo já conta a 1ª dose como dada no horário informado (padrão: agora) e mostra "Última dose" e "Próxima dose" com data e hora. "Dei a dose" registra a hora real; se a dose atrasou mais de 1h, a contagem recomeça dali.
- Folha de exportação: a coluna "Horários" diz o que é cada horário ("Última dada" e "Próxima"), e só lista tratamentos ainda em curso.
- Banho e cuidados: botão "Excluir" em cada cuidado, com confirmação.

**Atualização (cores, memorial, biometria)**
- Cada pet tem uma cor própria (terracota, sálvia, mostarda, céu, rosa, lavanda, menta), nos temas claro e escuro. O cinza aparece só no cartão de pet em memorial. O atraso agora é avisado pelo selo laranja sólido no cartão.
- Memorial: a foto ganhou uma coroa de louros com flores coloridas e um laço, no lugar da moldura.
- Login: o botão "Entrar com biometria" usa um ícone de digital.

**Atualização ("Dei a dose" direto do lembrete)**
- Na tela Lembretes, em "Doses de hoje", quando faltar 1h ou menos (ou a dose estiver atrasada) aparece o botão "Dei a dose". Ele atualiza o prontuário do pet e já começa a contar para a próxima dose. Essa seção agora fica no topo.
- O aviso dentro do app e a notificação do celular também têm o botão "Dei a dose". Na notificação, dá para registrar sem abrir o app.
- Para plataformas hospedeiras: a mensagem `esserepet:notificacao` agora traz `med`. Para registrar a dose, envie `postMessage({ tipo: "esserepet:deiDose", pet, med })` ao iframe ou chame `window.EsserePetApp.darDose(pet, med)` na webview.

## O que ainda depende de servidor
- **Notificação com o app fechado** precisa de Web Push com servidor (ou do push nativo da sua plataforma). Hoje os avisos saem enquanto o app está aberto. O `sw.js` já trata o evento `push`, então quando houver backend basta enviar.
- No **iPhone**, notificação de site só funciona com o app adicionado à Tela de Início (iOS 16.4 ou mais novo). Dentro do webview de outro app, só pela ponte acima.
- Os dados ficam **só neste aparelho e navegador** (não sincronizam entre celulares) e a senha não é conferida. Login real, sincronização e upload de fotos estão descritos no `INTEGRACOES.md` original.

## Para editar depois
Os fontes estão em `fontes/`. Depois de mexer no `EsserePet Web.dc.html`, gere o pacote de novo com `python3 gerar-pacote.py <pasta-de-saída>`. O script usa o `EsserePet Web (offline).html` original, que está ao lado, como carregador do arquivo único.
