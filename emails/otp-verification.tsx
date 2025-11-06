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

interface OTPVerificationEmailProps {
  userName: string;
  otp: string;
}

export const OTPVerificationEmail = ({
  userName,
  otp,
}: OTPVerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Seu código de verificação do AutoKeeper</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>🚗 AutoKeeper</Heading>
          <Text style={tagline}>Mantenha seus veículos em dia</Text>
        </Section>

        <Section style={content}>
          <Heading as="h2" style={h2}>
            Verificação de Email
          </Heading>

          <Text style={text}>Olá, {userName}!</Text>

          <Text style={text}>
            Para confirmar seu endereço de email e ativar sua conta no AutoKeeper,
            utilize o código de verificação abaixo:
          </Text>

          <Section style={otpBox}>
            <Text style={otpLabel}>Seu código de verificação:</Text>
            <Text style={otpCode}>{otp}</Text>
          </Section>

          <Section style={warning}>
            <Text style={warningText}>
              ⚠️ <strong>Importante:</strong> Este código expira em{" "}
              <strong>5 minutos</strong> e só pode ser usado uma vez.
            </Text>
          </Section>

          <Text style={text}>
            Se você não solicitou este código, por favor ignore este email.
            Sua conta permanecerá segura.
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

OTPVerificationEmail.PreviewProps = {
  userName: "João Silva",
  otp: "123456",
} as OTPVerificationEmailProps;

export default OTPVerificationEmail;

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

const otpBox = {
  backgroundColor: "#f3f4f6",
  border: "2px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  marginTop: "20px",
  marginBottom: "20px",
};

const otpLabel = {
  margin: "0 0 10px 0",
  fontSize: "14px",
  color: "#666",
};

const otpCode = {
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  color: "#2563eb",
  fontFamily: "'Courier New', monospace",
  margin: "0",
};

const warning = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  padding: "12px",
  marginTop: "20px",
  marginBottom: "20px",
};

const warningText = {
  fontSize: "14px",
  margin: "0",
  color: "#333",
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
