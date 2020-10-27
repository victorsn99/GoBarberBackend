# Recuperação de senha

**Requisitos Funcionais**

- O usuário deve poder recuperar sua senha informando o seu email;
- O usuário deve receber um email com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**Requisitos não-funcionais**

- Utilizar mailtrap para testar envio de emails em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de emails deve acontecer em segundo plano;

**Regras de negócio**

- O link enviado por email para resetar a senha deve expirar em duas horas;
- O usuário precisa confirmar a nova senha ao resetá-la;

# Atualização do perfil

**Requisitos Funcionais**

- O usuário deve poder atualizar seu perfil (nome, email e senha)

**Regras de negócio**

- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha, o usuário deve informar sua senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar sua nova senha;

# Painel do prestador

**Requisitos Funcionais**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**Requisitos não-funcionais**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devm ser armazenadas no MongoDB;
- As notificações devem ser enviadas em tempo real utilizando SocketIO;

**Regras de negócio**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# Agendamento de serviços

**Requisitos Funcionais**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**Requisitos não-funcionais**

- A listagem de prestadores deve ser armazenada em cache;

**Regras de negócio**

- Cada agendamento deve durar 1h exatamente;
- Oa angendamentos devem estar disponíveis entr 8h e 17h;
- O usuário não pode agendar no mesmo horário de outro usuário;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviçõs consigo mesmo;