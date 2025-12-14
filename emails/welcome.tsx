import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Row,
  Section,
  Text
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail = ({ userName = 'Usuário' }: WelcomeEmailProps) => (
  <Html lang="pt-BR">
    <Head>
      <title>Bem-vindo ao AutoKeeper!</title>
    </Head>
    <Body style={main}>
      <Container style={container}>
        {/* Logo Section */}
        <Section style={logoSection}>
          <div style={logoIconWrapper}>
            <div style={logoIcon}>🚗</div>
          </div>
          <Text style={brandName}>AutoKeeper</Text>
          <Text style={tagline}>Gestão Inteligente de Veículos</Text>
        </Section>

        {/* Welcome Message */}
        <Section style={contentSection}>
          <Text style={greeting}>Olá, {userName}! 👋</Text>
          <Text style={heading}>Bem-vindo ao AutoKeeper!</Text>
          <Text style={bodyText}>
            Sua conta foi criada com sucesso. Agora você pode manter seus
            veículos sempre em dia, sem dor de cabeça.
          </Text>
          <Text style={bodyText}>
            O AutoKeeper vai te ajudar a nunca mais esquecer datas importantes
            como IPVA, licenciamento, seguro e manutenções.
          </Text>
        </Section>

        {/* Features Highlight */}
        <Section style={featuresSection}>
          <Text style={featuresSectionTitle}>🚀 O que você pode fazer:</Text>

          {/* Feature 1 */}
          <Section style={featureItem}>
            <Row>
              <Column style={featureIconColumn}>
                <div style={featureIcon}>📅</div>
              </Column>
              <Column style={featureTextColumn}>
                <Text style={featureTitle}>Lembretes Inteligentes</Text>
                <Text style={featureDescription}>
                  Receba alertas antes do vencimento de IPVA, licenciamento,
                  seguro e revisões.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Feature 2 */}
          <Section style={featureItem}>
            <Row>
              <Column style={featureIconColumn}>
                <div style={featureIcon}>🚙</div>
              </Column>
              <Column style={featureTextColumn}>
                <Text style={featureTitle}>Múltiplos Veículos</Text>
                <Text style={featureDescription}>
                  Gerencie todos os seus veículos em um só lugar: carros, motos,
                  caminhões e mais.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Feature 3 */}
          <Section style={featureItem}>
            <Row>
              <Column style={featureIconColumn}>
                <div style={featureIcon}>📊</div>
              </Column>
              <Column style={featureTextColumn}>
                <Text style={featureTitle}>Histórico Completo</Text>
                <Text style={featureDescription}>
                  Acompanhe todas as manutenções e gastos do seu veículo ao
                  longo do tempo.
                </Text>
              </Column>
            </Row>
          </Section>
        </Section>

        {/* CTA Button */}
        <Section style={ctaSection}>
          <Text style={ctaText}>Pronto para começar?</Text>
          <Button style={ctaButton} href="https://autokeeper.app">
            Acessar AutoKeeper
          </Button>
        </Section>

        {/* Divider */}
        <Hr style={divider} />

        {/* Help Section */}
        <Section style={helpSection}>
          <Text style={helpTitle}>Precisa de ajuda?</Text>
          <Text style={helpText}>
            Se tiver alguma dúvida ou precisar de suporte, estamos aqui para
            ajudar. Basta responder este e-mail ou entrar em contato:
          </Text>
          <Link href="mailto:suporte@autokeeper.app" style={helpLink}>
            suporte@autokeeper.app
          </Link>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Obrigado por escolher o AutoKeeper!
            <br />
            Estamos felizes em ter você conosco. 🎉
          </Text>
          <Text style={footerTextMuted}>
            AutoKeeper - Gestão Inteligente de Veículos
            <br />© 2025 AutoKeeper. Todos os direitos reservados.
          </Text>
          <Text style={footerLinks}>
            <Link href="https://autokeeper.app/privacidade" style={footerLink}>
              Privacidade
            </Link>
            {' • '}
            <Link href="https://autokeeper.app/termos" style={footerLink}>
              Termos de Uso
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// ============================================
// STYLES - AutoKeeper Design System v1.0
// ============================================

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  padding: '40px 20px',
};

const container = {
  backgroundColor: '#121212',
  margin: '0 auto',
  padding: '48px 32px',
  maxWidth: '600px',
  borderRadius: '24px',
  border: '1px solid rgba(34, 211, 238, 0.2)',
};

// Logo Section
const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '40px',
};

const logoIconWrapper = {
  display: 'inline-block',
  marginBottom: '16px',
};

const logoIcon = {
  width: '72px',
  height: '72px',
  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
  margin: '0 auto',
  boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
};

const brandName = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
  letterSpacing: '-0.5px',
};

const tagline = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#9ca3af',
  margin: '0',
  lineHeight: '1.5',
};

// Content Section
const contentSection = {
  marginBottom: '32px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#22d3ee',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 24px 0',
  lineHeight: '1.2',
};

const bodyText = {
  fontSize: '16px',
  fontWeight: '400',
  color: '#f1f5f9',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

// Features Section
const featuresSection = {
  backgroundColor: 'rgba(30, 30, 30, 0.6)',
  border: '1px solid rgba(34, 211, 238, 0.15)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '32px',
};

const featuresSectionTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 20px 0',
  lineHeight: '1.5',
};

const featureItem = {
  marginBottom: '20px',
};

const featureIconColumn = {
  width: '48px',
  verticalAlign: 'top' as const,
};

const featureIcon = {
  width: '40px',
  height: '40px',
  backgroundColor: 'rgba(6, 182, 212, 0.15)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
};

const featureTextColumn = {
  paddingLeft: '12px',
  verticalAlign: 'top' as const,
};

const featureTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#f1f5f9',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};

const featureDescription = {
  fontSize: '14px',
  fontWeight: '400',
  color: '#9ca3af',
  margin: '0',
  lineHeight: '1.5',
};

// CTA Section
const ctaSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const ctaText = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#d1d5db',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const ctaButton = {
  backgroundColor: '#06b6d4',
  backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '12px',
  display: 'inline-block',
  boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
};

// Divider
const divider = {
  borderColor: 'rgba(34, 211, 238, 0.2)',
  borderWidth: '1px',
  margin: '32px 0',
};

// Help Section
const helpSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const helpTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 12px 0',
  lineHeight: '1.4',
};

const helpText = {
  fontSize: '14px',
  fontWeight: '400',
  color: '#9ca3af',
  margin: '0 0 12px 0',
  lineHeight: '1.6',
};

const helpLink = {
  color: '#22d3ee',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '14px',
};

// Footer
const footer = {
  textAlign: 'center' as const,
  paddingTop: '24px',
  borderTop: '1px solid rgba(34, 211, 238, 0.1)',
};

const footerText = {
  fontSize: '14px',
  fontWeight: '400',
  color: '#9ca3af',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const footerTextMuted = {
  fontSize: '13px',
  fontWeight: '400',
  color: '#64748b',
  lineHeight: '1.5',
  margin: '0 0 12px 0',
};

const footerLinks = {
  fontSize: '13px',
  margin: '0',
};

const footerLink = {
  color: '#6b7280',
  textDecoration: 'none',
};

WelcomeEmail.PreviewProps = {
  userName: "João Silva",
} as WelcomeEmailProps;