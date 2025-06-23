const process = require('process')
const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const queryNLPService = async (query) => {
  try {
    const prompt = `You are a helpful medical assistant. Provide general health information and advice, but always recommend consulting with healthcare professionals for proper diagnosis and treatment.

The user has the following symptoms: ${query}

Please provide:
1. A possible medical condition or general assessment
2. General self-care advice
3. When to seek medical attention
4. A clear disclaimer that this is for informational purposes only

Keep the response concise (under 150 words) and professional.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini response received successfully')
    return text.trim()
    
  } catch (error) {
    console.error('Error querying Gemini:', error)
    
    // Provide a fallback response if Gemini fails
    return `Based on the symptoms you described: "${query}"

This appears to be a health concern that requires attention. Here are some general recommendations:

• **Immediate care**: If symptoms are severe or worsening, seek immediate medical attention
• **Self-care**: Rest, stay hydrated, and monitor your symptoms
• **When to see a doctor**: If symptoms persist for more than 2-3 days or worsen
• **Professional consultation**: Please consult with a healthcare professional for proper diagnosis and treatment

⚠️ **Important**: This is general information only. For accurate medical advice, please consult with a qualified healthcare provider.

*Note: AI service temporarily unavailable. Please try again later or consult with a healthcare professional directly.*`
  }
}

module.exports = { queryNLPService }
