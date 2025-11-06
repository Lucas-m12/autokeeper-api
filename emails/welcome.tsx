import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo ao AutoKeeper!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>🚗 AutoKeeper</Heading>
          <Text style={tagline}>Mantenha seus veículos em dia</Text>
        </Section>

        <Section style={content}>
          <Heading as="h2" style={h2}>
            Bem-vindo(a), {userName}!
          </Heading>

          <Text style={text}>É um prazer ter você conosco! 🎉</Text>

          <Text style={text}>
            O <strong>AutoKeeper</strong> foi criado para ajudar você a nunca mais
            perder prazos importantes com seus veículos. Aqui você pode gerenciar:
          </Text>

          <Section style={listContainer}>
            <Text style={listItem}>📋 IPVA e licenciamento</Text>
            <Text style={listItem}>🔧 Manutenções preventivas</Text>
            <Text style={listItem}>🛡️ Renovação de seguro</Text>
            <Text style={listItem}>✅ Lembretes personalizados</Text>
          </Section>

          <Text style={text}>
            Estamos aqui para garantir que seus veículos estejam sempre em
            conformidade e bem cuidados. Qualquer dúvida, é só entrar em contato!
          </Text>

          <Text style={text}>Boas vindas e boa jornada!</Text>

          <Text style={signature}>
            <strong>Equipe AutoKeeper</strong>
            <br />
            <em>Mantenha seus veículos em dia</em>
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} AutoKeeper. Todos os direitos reservados.
          </Text>
          <Text style={footerText}>
            Este é um email automático, por favor não responda.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  userName: "João Silva",
} as WelcomeEmailProps;

export default WelcomeEmail;

// Styles
const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  paddingTop: "20px",
  paddingBottom: "20px",
  borderBottom: "3px solid #2563eb",
};

const headerTitle = {
  margin: "0",
  color: "#2563eb",
  fontSize: "28px",
};

const tagline = {
  color: "#666",
  fontSize: "14px",
  marginTop: "5px",
};

const content = {
  paddingTop: "30px",
  paddingBottom: "30px",
};

const h2 = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#333",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333",
};

const listContainer = {
  marginTop: "10px",
  marginBottom: "10px",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#333",
  margin: "5px 0",
  paddingLeft: "10px",
};

const signature = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333",
  marginTop: "30px",
};

const hr = {
  borderColor: "#e5e7eb",
  marginTop: "20px",
};

const footer = {
  textAlign: "center" as const,
  paddingTop: "20px",
};

const footerText = {
  color: "#666",
  fontSize: "12px",
  margin: "5px 0",
};
