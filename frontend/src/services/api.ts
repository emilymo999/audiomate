/**
 * API Service Layer for AudioMate
 * Centralized API calls to the backend
 */

const BASE_URL = 'http://localhost:5001';

// Helper function to convert language codes to language names
function getLanguageName(code: string): string {
  const languageMap: Record<string, string> = {
    'en': 'english',
    'es': 'spanish',
    'fr': 'french',
    'de': 'german',
    'it': 'italian',
    'pt': 'portuguese',
    'zh': 'chinese',
    'ja': 'japanese',
    'ko': 'korean',
    'ar': 'arabic',
    'hi': 'hindi',
    'ru': 'russian',
    'nl': 'dutch',
    'sv': 'swedish',
    'no': 'norwegian',
    'da': 'danish',
    'fi': 'finnish',
    'pl': 'polish',
    'tr': 'turkish',
    'vi': 'vietnamese',
    'th': 'thai',
    'cs': 'czech',
    'hu': 'hungarian',
    'ro': 'romanian',
    'he': 'hebrew',
    'el': 'greek',
    'uk': 'ukrainian',
    'ca': 'catalan',
    'hr': 'croatian',
    'sr': 'serbian',
    'sk': 'slovak',
    'bg': 'bulgarian',
    'et': 'estonian',
    'lv': 'latvian',
    'lt': 'lithuanian',
    'ga': 'irish',
    'mt': 'maltese',
    'sl': 'slovenian',
    'mk': 'macedonian',
    'af': 'afrikaans',
    'sw': 'swahili',
    'zu': 'zulu',
    'xh': 'xhosa',
    'yo': 'yoruba',
    'ig': 'igbo',
    'ha': 'hausa',
    'so': 'somali',
    'am': 'amharic',
    'bn': 'bengali',
    'gu': 'gujarati',
    'pa': 'punjabi',
    'ta': 'tamil',
    'te': 'telugu',
    'ml': 'malayalam',
    'kn': 'kannada',
    'mr': 'marathi',
    'ne': 'nepali',
    'si': 'sinhala',
    'my': 'myanmar',
    'km': 'khmer',
    'lo': 'lao',
    'mn': 'mongolian',
    'ka': 'georgian',
    'hy': 'armenian',
    'az': 'azerbaijani',
    'kk': 'kazakh',
    'ky': 'kyrgyz',
    'uz': 'uzbek',
    'tg': 'tajik',
    'tk': 'turkmen',
    'be': 'belarusian',
    'is': 'icelandic',
    'fo': 'faroese',
    'gd': 'scottish gaelic',
    'cy': 'welsh',
    'br': 'breton',
    'eu': 'basque',
    'gl': 'galician',
  };
  
  // If already a language name, return as-is
  if (!code || code.length > 2) return code || 'english';
  
  // Convert code to language name
  return languageMap[code.toLowerCase()] || 'english';
}

// Type definitions
export interface GenerateScriptRequest {
  product_name: string;
  product_details: string;
  company_context: string;
  target_audience: string;
  distribution_method: string;
  desired_length: number;
  example_output?: string;
  language: string;
}

export interface GenerateScriptResponse {
  script: string;
  inputs: GenerateScriptRequest;
}

export interface GenerateSpeechRequest {
  script: string;
  tone: 'friendly' | 'professional' | 'casual' | 'dramatic' | 'calm';
  gender: 'male' | 'female' | 'neutral';
  background_music: 'none' | 'ambient' | 'upbeat' | 'classical' | 'electronic' | 'acoustic';
  language: string;
}

export interface GenerateSpeechResponse {
  filename: string;
  filepath: string;
  message: string;
}

export interface ApiError {
  error: string;
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// API Functions

/**
 * Generate a script using the LLM API
 * @param data - The script generation parameters
 * @returns Promise containing the generated script
 */
export async function generateScript(
  data: GenerateScriptRequest
): Promise<GenerateScriptResponse> {
  // Map the request to match backend expectations
  // Backend expects: product_name, product_details, company_context, 
  // target_audience, distribution_method, desired_length (string), example_output, language
  // Convert language code to language name for backend
  const languageName = getLanguageName(data.language);
  
  const requestData = {
    product_name: data.product_name,
    product_details: data.product_details,
    company_context: data.company_context,
    target_audience: data.target_audience,
    distribution_method: data.distribution_method,
    desired_length: data.desired_length.toString(),
    example_output: data.example_output || '',
    language: languageName,
  };

  return fetchApi<GenerateScriptResponse>('/api/generate-script', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

/**
 * Generate speech from a script using ElevenLabs API
 * @param data - The speech generation parameters
 * @returns Promise containing the generated audio file information
 */
export async function generateSpeech(
  data: GenerateSpeechRequest
): Promise<GenerateSpeechResponse> {
  // Convert language code to language name for backend
  const languageName = getLanguageName(data.language);
  
  return fetchApi<GenerateSpeechResponse>('/api/generate-speech', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      language: languageName,
    }),
  });
}

/**
 * Get an audio file by filename
 * @param filename - The name of the audio file
 * @returns The audio file as a blob
 */
export async function getAudio(filename: string): Promise<Blob> {
  const url = `${BASE_URL}/api/audio/${filename}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Get the URL for an audio file
 * @param filename - The name of the audio file
 * @returns The full URL to the audio file
 */
export function getAudioUrl(filename: string): string {
  return `${BASE_URL}/api/audio/${filename}`;
}

