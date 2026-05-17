/**
 * AI Financial Education Chatbot Assistant Logic
 * Provides strict educational guidance on personal finance concepts simply.
 * All user inputs and AI outputs are passed through the global compliance
 * utility to block disallowed phrases and replace them with safe alternatives.
 */

import { applyCompliance } from '@/lib/compliance';

export function generateEducationalResponse(query: string): string {
  // Sanitize user query first
  const sanitizedInput = applyCompliance(query);
  const normalized = sanitizedInput.toLowerCase().trim().replace(/[?.,!]/g, '');

  // 1. Safety trigger: block prohibited language
  if (
    normalized.includes('best option') ||
    normalized.includes('recommend') ||
    normalized.includes('guarantee') ||
    normalized.includes('which is better') ||
    normalized.includes('which should i') ||
    normalized.includes('should i invest in') ||
    normalized.includes('how much return')
  ) {
    return "I am your educational assistant. To remain objective and follow regulatory standards, I cannot recommend specific investments, guarantee returns, or designate any model as the 'best option'. I can, however, explain how fixed deposits, index funds, PPF, or SGBs work side-by-side! Let me know if you would like me to unpack any of these concepts.";
  }

  // 2. Question: "what is SIP"
  if (normalized === 'what is sip' || normalized.includes('what is a sip') || normalized.includes('explain sip')) {
    return "A Systematic Investment Plan (SIP) is a smart, disciplined mode of investing in mutual funds. Rather than committing a single large lump sum, a SIP allows you to invest a fixed amount regularly (e.g. monthly). This strategy helps you leverage market volatility through rupee cost averaging (buying more units when prices are low and fewer when prices are high), allowing your savings to compound reliably over the long term without needing to time the market.";
  }

  // 3. Question: "what is PPF"
  if (normalized === 'what is ppf' || normalized.includes('what is a ppf') || normalized.includes('explain ppf')) {
    return "The Public Provident Fund (PPF) is a highly secure, government-backed savings scheme designed to provide secure long-term retirement savings. It carries an EEE (Exempt-Exempt-Exempt) tax classification. This means your initial investment deposits, the annual interest earned, and the final maturity proceeds are completely tax-free. It has a lock-in maturity of 15 years, offering a safe, risk-free foundation for conservative growth.";
  }

  // 4. Question: "should I save first"
  if (
    normalized.includes('should i save first') ||
    normalized.includes('save first') ||
    normalized.includes('saving vs investing')
  ) {
    return "In personal finance, building a secure liquid safety reserve is generally recommended before starting your investment journey. Establishing a liquid emergency fund (covering 3 to 6 months of basic living expenses) protects you from unexpected life events like a medical emergency or temporary job loss. This ensures you do not have to disrupt and liquidate your long-term growth investments early when emergencies occur.";
  }

  // 5. Question: "how to start saving"
  if (
    normalized.includes('how to start saving') ||
    normalized.includes('start saving') ||
    normalized.includes('how can i save')
  ) {
    return "To start saving simply, you can follow these four standard steps:\n\n1. **Track Cash Flows**: List your monthly income and write down your fixed needs (rent, utilities) versus discretionary wants (dining, shopping).\n2. **Pay Yourself First**: Set aside a target portion (e.g., 10-20% of your earnings) into a separate account immediately on payday, rather than saving whatever happens to be left at the end of the month.\n3. **Automate**: Configure a recurring deposit (RD) or automatic transfers to a dedicated savings account.\n4. **Prioritize the Buffer**: Direct your initial monthly savings toward an easily accessible emergency cash fund.";
  }

  // 6. Generic educational concept queries matching (for other schemes from our explorer)
  if (normalized.includes('fixed deposit') || normalized.includes('what is fd')) {
    return "A Fixed Deposit (FD) is a secure saving instrument offered by banks and post offices. You deposit a lump sum for a fixed term (e.g. 1 to 5 years) at a guaranteed interest rate. FDs are completely immune to equity market volatility, making them highly reliable for capital preservation.";
  }

  if (normalized.includes('gold') || normalized.includes('sgb')) {
    return "Gold is a traditional tool for wealth preservation and an inflation hedge. Modern gold saving methods include Sovereign Gold Bonds (SGBs) and Digital Gold. These secure formats eliminate physical storage risks, offer easy liquidity, and track gold market rates safely.";
  }

  if (normalized.includes('chit fund')) {
    return "Chit funds are traditional rotating savings and credit arrangements popular in local communities. While they offer quick credit access during emergencies, they carry operational and credit risks due to the lack of strict banking regulations and the risk of participant default.";
  }

  if (normalized.includes('insurance') || normalized.includes('health') || normalized.includes('term')) {
    return "Insurance serves as the primary shield for risk protection. Health insurance covers medical and hospitalization expenses, protecting your assets from unexpected healthcare drains. Term insurance provides high-coverage pure life protection for your dependents in exchange for a low, fixed premium.";
  }

  // 7. General compliant fallback
  return "I am a financial education assistant here to explain personal finance models and concepts simply. To help you evaluate secure strategies, I cannot suggest investments, guarantee specific returns, or declare any scheme the 'best option'. I can explain Systematic Investment Plans (SIP), Fixed Deposits (FD), PPF, Gold Bonds, emergency funds, or insurance models! What concept can I clarify for you today?";
}
