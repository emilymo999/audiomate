#!/usr/bin/env python3
"""
ElevenLabs Speech Generator

A simple Python script to convert text to speech using the ElevenLabs API.
"""

import os
import sys
import argparse
import requests
import json
from pathlib import Path
try:
    from pydub import AudioSegment
    from pydub.effects import normalize
    AUDIO_MIXING_AVAILABLE = True
except ImportError as e:
    print(f"⚠️  pydub import failed: {e}")
    print("⚠️  Background music will use simple audio generation instead")
    AUDIO_MIXING_AVAILABLE = False


class ElevenLabsSpeechGenerator:
    def __init__(self, api_key=None):
        """Initialize the speech generator with API key."""
        self.api_key = api_key or os.getenv('ELEVENLABS_API_KEY')
        if not self.api_key:
            raise ValueError("API key is required. Set ELEVENLABS_API_KEY environment variable or pass it as argument.")
        
        self.base_url = "https://api.elevenlabs.io/v1"
        self.headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        
        # Voice characteristics mapping
        self.voice_characteristics = {
            'tone': {
                'friendly': ['warm', 'cheerful', 'upbeat', 'kind', 'welcoming', 'pleasant', 'nice', 'gentle', 'sweet', 'caring', 'supportive', 'encouraging', 'positive', 'optimistic', 'happy', 'joyful', 'lively', 'vibrant', 'energetic', 'enthusiastic', 'excited', 'animated', 'bubbly', 'sunny', 'bright', 'cheery', 'upbeat', 'lively', 'spirited', 'vivacious', 'radiant', 'glowing', 'beaming', 'smiling', 'grinning', 'chirpy', 'perky', 'peppy', 'zippy', 'snappy', 'bouncy', 'springy', 'elastic', 'flexible', 'adaptable', 'versatile', 'accommodating', 'helpful', 'assisting', 'supportive', 'encouraging', 'motivating', 'inspiring', 'uplifting', 'heartwarming', 'touching', 'moving', 'emotional', 'sentimental', 'tender', 'soft', 'mild', 'gentle', 'smooth', 'easy', 'comfortable', 'cozy', 'snug', 'warm', 'toasty', 'inviting', 'welcoming', 'hospitable', 'gracious', 'courteous', 'polite', 'respectful', 'considerate', 'thoughtful', 'mindful', 'attentive', 'caring', 'loving', 'affectionate', 'fond', 'devoted', 'loyal', 'faithful', 'true', 'genuine', 'authentic', 'real', 'honest', 'sincere', 'earnest', 'serious', 'committed', 'dedicated', 'passionate', 'fervent', 'ardent', 'zealous', 'eager', 'keen', 'enthusiastic', 'excited', 'thrilled', 'delighted', 'pleased', 'satisfied', 'content', 'happy', 'joyful', 'merry', 'jolly', 'cheerful', 'upbeat', 'positive', 'optimistic', 'hopeful', 'confident', 'assured', 'certain', 'sure', 'definite', 'clear', 'obvious', 'evident', 'apparent', 'visible', 'noticeable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'compelling', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'convincing', 'persuasive', 'compelling', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'professional': ['formal', 'authoritative', 'clear', 'business', 'corporate', 'executive', 'managerial', 'administrative', 'official', 'ceremonial', 'ritual', 'traditional', 'conventional', 'standard', 'normal', 'regular', 'typical', 'usual', 'common', 'ordinary', 'everyday', 'routine', 'systematic', 'methodical', 'organized', 'structured', 'disciplined', 'controlled', 'regulated', 'governed', 'managed', 'supervised', 'overseen', 'monitored', 'tracked', 'measured', 'evaluated', 'assessed', 'analyzed', 'examined', 'studied', 'researched', 'investigated', 'explored', 'discovered', 'found', 'identified', 'recognized', 'acknowledged', 'accepted', 'approved', 'endorsed', 'supported', 'backed', 'sponsored', 'funded', 'financed', 'invested', 'committed', 'dedicated', 'devoted', 'loyal', 'faithful', 'true', 'genuine', 'authentic', 'real', 'honest', 'sincere', 'earnest', 'serious', 'grave', 'solemn', 'dignified', 'respectable', 'honorable', 'noble', 'distinguished', 'eminent', 'prominent', 'notable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'compelling', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'convincing', 'persuasive', 'compelling', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'casual': ['relaxed', 'conversational', 'informal', 'easy', 'comfortable', 'cozy', 'snug', 'warm', 'toasty', 'inviting', 'welcoming', 'hospitable', 'gracious', 'courteous', 'polite', 'respectful', 'considerate', 'thoughtful', 'mindful', 'attentive', 'caring', 'loving', 'affectionate', 'fond', 'devoted', 'loyal', 'faithful', 'true', 'genuine', 'authentic', 'real', 'honest', 'sincere', 'earnest', 'serious', 'committed', 'dedicated', 'passionate', 'fervent', 'ardent', 'zealous', 'eager', 'keen', 'enthusiastic', 'excited', 'thrilled', 'delighted', 'pleased', 'satisfied', 'content', 'happy', 'joyful', 'merry', 'jolly', 'cheerful', 'upbeat', 'positive', 'optimistic', 'hopeful', 'confident', 'assured', 'certain', 'sure', 'definite', 'clear', 'obvious', 'evident', 'apparent', 'visible', 'noticeable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'compelling', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'convincing', 'persuasive', 'compelling', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'dramatic': ['expressive', 'theatrical', 'powerful', 'intense', 'passionate', 'emotional', 'moving', 'touching', 'stirring', 'inspiring', 'uplifting', 'motivating', 'encouraging', 'supportive', 'helpful', 'assisting', 'accommodating', 'versatile', 'adaptable', 'flexible', 'elastic', 'springy', 'bouncy', 'snappy', 'zippy', 'peppy', 'perky', 'chirpy', 'grinning', 'smiling', 'beaming', 'glowing', 'radiant', 'vivacious', 'spirited', 'lively', 'bubbly', 'animated', 'excited', 'enthusiastic', 'eager', 'keen', 'thrilled', 'delighted', 'pleased', 'satisfied', 'content', 'happy', 'joyful', 'merry', 'jolly', 'cheerful', 'upbeat', 'positive', 'optimistic', 'hopeful', 'confident', 'assured', 'certain', 'sure', 'definite', 'clear', 'obvious', 'evident', 'apparent', 'visible', 'noticeable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'compelling', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'convincing', 'persuasive', 'compelling', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'calm': ['soothing', 'gentle', 'peaceful', 'tranquil', 'serene', 'quiet', 'still', 'silent', 'hushed', 'muted', 'soft', 'mild', 'tender', 'delicate', 'fragile', 'sensitive', 'vulnerable', 'open', 'honest', 'sincere', 'earnest', 'serious', 'grave', 'solemn', 'dignified', 'respectable', 'honorable', 'noble', 'distinguished', 'eminent', 'prominent', 'notable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'compelling', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'convincing', 'persuasive', 'compelling', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized']
            },
            'gender': {
                'male': ['masculine', 'deep', 'male', 'man', 'guy', 'masculine', 'baritone', 'bass', 'husky', 'gruff', 'deep voice', 'male voice', 'man\'s voice', 'guy\'s voice'],
                'female': ['feminine', 'soft', 'female', 'woman', 'lady', 'girl', 'soprano', 'alto', 'sweet', 'gentle', 'female voice', 'woman\'s voice', 'lady\'s voice', 'girl\'s voice'],
                'neutral': ['androgynous', 'neutral', 'unisex', 'gender-neutral', 'unisex voice', 'neutral voice']
            },
            'background_music': {
                'none': 'no background music',
                'ambient': 'subtle ambient sounds',
                'upbeat': 'energetic background music',
                'classical': 'classical music background',
                'electronic': 'electronic music background',
                'acoustic': 'acoustic music background'
            }
        }
        
        # Language codes mapping
        self.language_codes = {
            'english': 'en',
            'spanish': 'es',
            'french': 'fr',
            'german': 'de',
            'italian': 'it',
            'portuguese': 'pt',
            'russian': 'ru',
            'japanese': 'ja',
            'korean': 'ko',
            'chinese': 'zh',
            'arabic': 'ar',
            'hindi': 'hi',
            'dutch': 'nl',
            'swedish': 'sv',
            'norwegian': 'no',
            'danish': 'da',
            'finnish': 'fi',
            'polish': 'pl',
            'czech': 'cs',
            'hungarian': 'hu',
            'greek': 'el',
            'turkish': 'tr',
            'hebrew': 'he',
            'thai': 'th',
            'vietnamese': 'vi',
            'indonesian': 'id',
            'malay': 'ms',
            'tagalog': 'tl',
            'ukrainian': 'uk',
            'bulgarian': 'bg',
            'croatian': 'hr',
            'serbian': 'sr',
            'slovak': 'sk',
            'slovenian': 'sl',
            'estonian': 'et',
            'latvian': 'lv',
            'lithuanian': 'lt',
            'romanian': 'ro',
            'catalan': 'ca',
            'basque': 'eu',
            'galician': 'gl'
        }
        
        # Background music file mapping - update these paths to your actual files
        self.background_music_files = {
            'ambient': 'background_music/ambient.mp3',
            'upbeat': 'background_music/upbeat.mp3', 
            'classical': 'background_music/classical.mp3',
            'electronic': 'background_music/electronic.mp3',
            'acoustic': 'background_music/acoustic.mp3',
            'none': None  # No background music option
        }

    def analyze_tone_sentiment(self, tone_description):
        """
        Analyze natural language tone description and map it to the closest ElevenLabs tone.
        Uses keyword matching and scoring to determine the best tone match.
        """
        if not tone_description:
            return None
        
        tone_description = tone_description.lower().strip()
        
        # Direct matches first
        if tone_description in ['friendly', 'professional', 'casual', 'dramatic', 'calm']:
            return tone_description
        
        # Calculate similarity scores for each tone category
        tone_scores = {}
        
        for tone_category, keywords in self.voice_characteristics['tone'].items():
            score = 0
            
            # Split the input into words
            input_words = tone_description.split()
            
            # Check for exact word matches
            for word in input_words:
                if word in keywords:
                    score += 3  # High score for exact matches
            
            # Check for partial matches (substring matching)
            for keyword in keywords:
                if keyword in tone_description or tone_description in keyword:
                    score += 2  # Medium score for partial matches
            
            # Check for semantic similarity (basic word relationships)
            semantic_matches = {
                'friendly': ['nice', 'kind', 'warm', 'welcoming', 'pleasant', 'cheerful', 'happy', 'joyful', 'upbeat', 'positive', 'optimistic', 'encouraging', 'supportive', 'caring', 'loving', 'sweet', 'gentle', 'soft', 'tender', 'mild', 'easy', 'comfortable', 'cozy', 'inviting', 'gracious', 'polite', 'respectful', 'considerate', 'thoughtful', 'attentive', 'helpful', 'assisting', 'accommodating', 'versatile', 'adaptable', 'flexible', 'motivating', 'inspiring', 'uplifting', 'heartwarming', 'touching', 'moving', 'emotional', 'sentimental', 'genuine', 'authentic', 'real', 'honest', 'sincere', 'earnest', 'committed', 'dedicated', 'passionate', 'enthusiastic', 'excited', 'thrilled', 'delighted', 'pleased', 'satisfied', 'content', 'confident', 'assured', 'certain', 'sure', 'clear', 'obvious', 'evident', 'apparent', 'visible', 'noticeable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'professional': ['formal', 'business', 'corporate', 'executive', 'managerial', 'administrative', 'official', 'ceremonial', 'traditional', 'conventional', 'standard', 'normal', 'regular', 'typical', 'usual', 'common', 'ordinary', 'routine', 'systematic', 'methodical', 'organized', 'structured', 'disciplined', 'controlled', 'regulated', 'governed', 'managed', 'supervised', 'monitored', 'tracked', 'measured', 'evaluated', 'assessed', 'analyzed', 'examined', 'studied', 'researched', 'investigated', 'explored', 'discovered', 'found', 'identified', 'recognized', 'acknowledged', 'accepted', 'approved', 'endorsed', 'supported', 'backed', 'sponsored', 'funded', 'financed', 'invested', 'committed', 'dedicated', 'devoted', 'loyal', 'faithful', 'true', 'genuine', 'authentic', 'real', 'honest', 'sincere', 'earnest', 'serious', 'grave', 'solemn', 'dignified', 'respectable', 'honorable', 'noble', 'distinguished', 'eminent', 'prominent', 'notable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'casual': ['relaxed', 'conversational', 'informal', 'easy', 'comfortable', 'cozy', 'snug', 'warm', 'toasty', 'inviting', 'welcoming', 'hospitable', 'gracious', 'courteous', 'polite', 'respectful', 'considerate', 'thoughtful', 'mindful', 'attentive', 'caring', 'loving', 'affectionate', 'fond', 'devoted', 'loyal', 'faithful', 'true', 'genuine', 'authentic', 'real', 'honest', 'sincere', 'earnest', 'serious', 'committed', 'dedicated', 'passionate', 'fervent', 'ardent', 'zealous', 'eager', 'keen', 'enthusiastic', 'excited', 'thrilled', 'delighted', 'pleased', 'satisfied', 'content', 'happy', 'joyful', 'merry', 'jolly', 'cheerful', 'upbeat', 'positive', 'optimistic', 'hopeful', 'confident', 'assured', 'certain', 'sure', 'definite', 'clear', 'obvious', 'evident', 'apparent', 'visible', 'noticeable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'dramatic': ['expressive', 'theatrical', 'powerful', 'intense', 'passionate', 'emotional', 'moving', 'touching', 'stirring', 'inspiring', 'uplifting', 'motivating', 'encouraging', 'supportive', 'helpful', 'assisting', 'accommodating', 'versatile', 'adaptable', 'flexible', 'elastic', 'springy', 'bouncy', 'snappy', 'zippy', 'peppy', 'perky', 'chirpy', 'grinning', 'smiling', 'beaming', 'glowing', 'radiant', 'vivacious', 'spirited', 'lively', 'bubbly', 'animated', 'excited', 'enthusiastic', 'eager', 'keen', 'thrilled', 'delighted', 'pleased', 'satisfied', 'content', 'happy', 'joyful', 'merry', 'jolly', 'cheerful', 'upbeat', 'positive', 'optimistic', 'hopeful', 'confident', 'assured', 'certain', 'sure', 'definite', 'clear', 'obvious', 'evident', 'apparent', 'visible', 'noticeable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized'],
                'calm': ['soothing', 'gentle', 'peaceful', 'tranquil', 'serene', 'quiet', 'still', 'silent', 'hushed', 'muted', 'soft', 'mild', 'tender', 'delicate', 'fragile', 'sensitive', 'vulnerable', 'open', 'honest', 'sincere', 'earnest', 'serious', 'grave', 'solemn', 'dignified', 'respectable', 'honorable', 'noble', 'distinguished', 'eminent', 'prominent', 'notable', 'remarkable', 'outstanding', 'excellent', 'superior', 'great', 'wonderful', 'fantastic', 'amazing', 'incredible', 'awesome', 'brilliant', 'magnificent', 'splendid', 'gorgeous', 'beautiful', 'lovely', 'charming', 'attractive', 'appealing', 'engaging', 'captivating', 'fascinating', 'interesting', 'intriguing', 'compelling', 'persuasive', 'convincing', 'powerful', 'strong', 'robust', 'sturdy', 'solid', 'firm', 'stable', 'steady', 'reliable', 'dependable', 'trustworthy', 'credible', 'believable', 'influential', 'impactful', 'effective', 'successful', 'productive', 'fruitful', 'beneficial', 'advantageous', 'profitable', 'valuable', 'precious', 'treasured', 'cherished', 'beloved', 'adored', 'loved', 'worshiped', 'revered', 'respected', 'honored', 'esteemed', 'admired', 'appreciated', 'valued', 'prized']
            }
            
            for word in input_words:
                if word in semantic_matches.get(tone_category, []):
                    score += 1  # Lower score for semantic matches
            
            tone_scores[tone_category] = score
        
        # Find the tone with the highest score
        best_tone = max(tone_scores, key=tone_scores.get)
        best_score = tone_scores[best_tone]
        
        # Only return a tone if we have a reasonable confidence (score > 0)
        if best_score > 0:
            print(f"🎭 Analyzed tone: '{tone_description}' → '{best_tone}' (confidence: {best_score})")
            return best_tone
        else:
            print(f"⚠️  Could not analyze tone: '{tone_description}'. Using default tone.")
            return None

    def get_voices(self):
        """Get list of available voices."""
        try:
            response = requests.get(f"{self.base_url}/voices", headers=self.headers)
            response.raise_for_status()
            return response.json()["voices"]
        except requests.exceptions.RequestException as e:
            print(f"Error fetching voices: {e}")
            return []

    def list_voices(self, tone=None, gender=None, language=None):
        """List all available voices with optional filtering."""
        voices = self.get_voices()
        if not voices:
            print("No voices available or error fetching voices.")
            return
        
        # Filter voices based on criteria
        filtered_voices = self.filter_voices(voices, tone, gender, language)
        
        print(f"\nAvailable voices ({len(filtered_voices)} found):")
        print("-" * 60)
        for voice in filtered_voices:
            print(f"ID: {voice['voice_id']}")
            print(f"Name: {voice['name']}")
            print(f"Category: {voice.get('category', 'Unknown')}")
            print(f"Description: {voice.get('description', 'No description')}")
            print(f"Labels: {voice.get('labels', {})}")
            print("-" * 60)
    
    def filter_voices(self, voices, tone=None, gender=None, language=None):
        """Filter voices based on tone, gender, and language criteria."""
        filtered = voices
        
        if tone:
            tone_keywords = self.voice_characteristics['tone'].get(tone.lower(), [])
            if tone_keywords:
                filtered = [v for v in filtered if any(
                    keyword.lower() in v.get('description', '').lower() or
                    keyword.lower() in v.get('name', '').lower() or
                    any(keyword.lower() in str(label).lower() for label in v.get('labels', {}).values())
                    for keyword in tone_keywords
                )]
        
        if gender:
            gender_keywords = self.voice_characteristics['gender'].get(gender.lower(), [])
            if gender_keywords:
                filtered = [v for v in filtered if any(
                    keyword.lower() in v.get('description', '').lower() or
                    keyword.lower() in v.get('name', '').lower() or
                    any(keyword.lower() in str(label).lower() for label in v.get('labels', {}).values())
                    for keyword in gender_keywords
                )]
        
        if language:
            lang_code = self.language_codes.get(language.lower())
            if lang_code:
                filtered = [v for v in filtered if 
                    lang_code in v.get('labels', {}).get('language', '').lower() or
                    language.lower() in v.get('description', '').lower() or
                    language.lower() in v.get('name', '').lower()
                ]
        
        return filtered
    
    def score_voice(self, voice, tone=None, gender=None, language=None):
        """Score a voice based on how well it matches the desired characteristics."""
        score = 0
        voice_text = f"{voice.get('name', '')} {voice.get('description', '')} {str(voice.get('labels', {}))}".lower()
        
        # Score based on tone
        if tone:
            tone_keywords = self.voice_characteristics['tone'].get(tone.lower(), [])
            for keyword in tone_keywords:
                if keyword.lower() in voice_text:
                    score += 3
            # Bonus for exact tone matches in name
            if tone.lower() in voice.get('name', '').lower():
                score += 5
        
        # Score based on gender - higher priority for logic
        if gender:
            gender_keywords = self.voice_characteristics['gender'].get(gender.lower(), [])
            gender_matches = 0
            gender_score = 0
            
            # Check for gender keywords in description
            for keyword in gender_keywords:
                if keyword.lower() in voice_text:
                    gender_score += 5  # Increased from 3 to 5
                    gender_matches += 1
            
            # Bonus for exact gender matches in name
            if gender.lower() in voice.get('name', '').lower():
                gender_score += 10  # Increased from 5 to 10
                gender_matches += 1
            
            # Additional scoring for common male/female indicators
            if gender.lower() == 'male':
                # Look for common male voice indicators
                male_indicators = ['adam', 'alex', 'andrew', 'anthony', 'brian', 'chris', 'daniel', 'david', 'eric', 'james', 'john', 'kevin', 'michael', 'paul', 'robert', 'steven', 'thomas', 'william', 'carlos', 'jose', 'antonio', 'francisco', 'manuel', 'david', 'juan', 'rafael', 'pedro', 'alejandro', 'miguel', 'jorge', 'fernando', 'sergio', 'alberto', 'pablo', 'mario', 'luis', 'diego', 'andres', 'javier', 'ricardo', 'roberto', 'eduardo', 'oscar', 'arturo', 'ramon', 'enrique', 'guillermo', 'salvador', 'victor', 'hugo', 'ignacio', 'adrian', 'sebastian', 'gabriel', 'emilio', 'raul', 'cesar', 'ruben', 'daniel', 'joaquin', 'alvaro', 'gonzalo', 'felix', 'marcos', 'nacho', 'israel', 'jordi', 'xavier', 'xavi']
                for indicator in male_indicators:
                    if indicator in voice.get('name', '').lower():
                        gender_score += 8  # Increased from 2 to 8
                        gender_matches += 1
                        break
            elif gender.lower() == 'female':
                # Look for common female voice indicators
                female_indicators = ['sarah', 'emma', 'olivia', 'ava', 'isabella', 'sophia', 'charlotte', 'mia', 'amelia', 'harper', 'evelyn', 'abigail', 'emily', 'elizabeth', 'sofia', 'avery', 'ella', 'madison', 'scarlett', 'victoria', 'alice', 'maria', 'carmen', 'ana', 'lucia', 'elena', 'patricia', 'monica', 'isabel', 'cristina', 'laura', 'andrea', 'natalia', 'paula', 'sandra', 'raquel', 'beatriz', 'dolores', 'pilar', 'teresa', 'mercedes']
                for indicator in female_indicators:
                    if indicator in voice.get('name', '').lower():
                        gender_score += 8  # Increased from 2 to 8
                        gender_matches += 1
                        break
            
            # Penalty for wrong gender indicators
            if gender.lower() == 'male':
                # Penalize female indicators
                female_penalty_words = ['woman', 'female', 'lady', 'girl', 'soprano', 'alto', 'sweet', 'gentle']
                for word in female_penalty_words:
                    if word in voice_text:
                        gender_score -= 5
            elif gender.lower() == 'female':
                # Penalize male indicators
                male_penalty_words = ['man', 'male', 'guy', 'baritone', 'bass', 'husky', 'gruff']
                for word in male_penalty_words:
                    if word in voice_text:
                        gender_score -= 5
            
            score += gender_score
        
        # Score based on language
        if language:
            lang_code = self.language_codes.get(language.lower())
            language_score = 0
            
            # Check for language code in voice labels
            if lang_code and lang_code in voice_text:
                language_score += 5  
            
            # Check for language name in voice text
            if language.lower() in voice_text:
                language_score += 8  
            
            # Check for language-specific keywords
            if language.lower() == 'spanish':
                spanish_keywords = ['español', 'espanol', 'castellano', 'hispano', 'latino', 'mexicano', 'argentino', 'colombiano', 'española', 'espanola']
                for keyword in spanish_keywords:
                    if keyword in voice_text:
                        language_score += 6
                        break
            elif language.lower() == 'french':
                french_keywords = ['français', 'francais', 'francophone', 'française', 'francaise']
                for keyword in french_keywords:
                    if keyword in voice_text:
                        language_score += 6
                        break
            elif language.lower() == 'german':
                german_keywords = ['deutsch', 'deutsche', 'german', 'germanic']
                for keyword in german_keywords:
                    if keyword in voice_text:
                        language_score += 6
                        break
            
            score += language_score
        
        # Bonus for high-quality voices
        category = voice.get('category', '').lower()
        if category in ['premade', 'cloned', 'professional']:
            score += 2
        
        # Bonus for voices with good descriptions
        if len(voice.get('description', '')) > 20:
            score += 1
            
        return score
    
    def select_best_voice(self, voices, tone=None, gender=None, language=None):
        """Intelligently select the best voice based on tone, gender, and language."""
        if not voices:
            return None
        
        # Score all voices
        scored_voices = []
        for voice in voices:
            score = self.score_voice(voice, tone, gender, language)
            scored_voices.append((voice, score))
        
        # Sort by score (highest first)
        scored_voices.sort(key=lambda x: x[1], reverse=True)
        
        # Show top 3 candidates for debugging
        print(f"Evaluating {len(voices)} voices...")
        print("Top 3 voice candidates:")
        for i, (voice, score) in enumerate(scored_voices[:3]):
            print(f"  {i+1}. {voice['name']} - Score: {score} - {voice.get('description', 'No description')[:50]}...")
        
        # Filter voices based on gender and language requirements
        filtered_voices = []
        for voice, score in scored_voices:
            voice_text = f"{voice.get('name', '')} {voice.get('description', '')} {str(voice.get('labels', {}))}".lower()
            
            # Check gender match
            gender_match = True
            if gender:
                if gender.lower() == 'male':
                    male_indicators = ['adam', 'alex', 'andrew', 'anthony', 'brian', 'chris', 'daniel', 'david', 'eric', 'james', 'john', 'kevin', 'michael', 'paul', 'robert', 'steven', 'thomas', 'william', 'carlos', 'jose', 'antonio', 'francisco', 'manuel', 'juan', 'rafael', 'pedro', 'alejandro', 'miguel', 'jorge', 'fernando', 'sergio', 'alberto', 'pablo', 'mario', 'luis', 'diego', 'andres', 'javier', 'ricardo', 'roberto', 'eduardo', 'oscar', 'arturo', 'ramon', 'enrique', 'guillermo', 'salvador', 'victor', 'hugo', 'ignacio', 'adrian', 'sebastian', 'gabriel', 'emilio', 'raul', 'cesar', 'ruben', 'daniel', 'joaquin', 'alvaro', 'gonzalo', 'felix', 'marcos', 'nacho', 'israel', 'jordi', 'xavier', 'xavi', 'masculine', 'male', 'man', 'guy', 'baritone', 'bass', 'husky', 'gruff']
                    gender_match = any(indicator in voice_text for indicator in male_indicators)
                elif gender.lower() == 'female':
                    female_indicators = ['sarah', 'emma', 'olivia', 'ava', 'isabella', 'sophia', 'charlotte', 'mia', 'amelia', 'harper', 'evelyn', 'abigail', 'emily', 'elizabeth', 'sofia', 'avery', 'ella', 'madison', 'scarlett', 'victoria', 'alice', 'maria', 'carmen', 'ana', 'lucia', 'elena', 'patricia', 'monica', 'isabel', 'cristina', 'laura', 'andrea', 'natalia', 'paula', 'sandra', 'raquel', 'beatriz', 'dolores', 'pilar', 'teresa', 'mercedes', 'feminine', 'female', 'woman', 'lady', 'girl', 'soprano', 'alto', 'sweet', 'gentle']
                    gender_match = any(indicator in voice_text for indicator in female_indicators)
                else:  # neutral
                    gender_match = True
            
            # Check language match
            language_match = True
            if language:
                lang_code = self.language_codes.get(language.lower())
                language_indicators = [language.lower()]
                if lang_code:
                    language_indicators.append(lang_code)
                
                # Add language-specific keywords
                if language.lower() == 'spanish':
                    language_indicators.extend(['español', 'espanol', 'castellano', 'hispano', 'latino', 'mexicano', 'argentino', 'colombiano'])
                elif language.lower() == 'french':
                    language_indicators.extend(['français', 'francais', 'francophone'])
                elif language.lower() == 'german':
                    language_indicators.extend(['deutsch', 'deutsche', 'german'])
                
                language_match = any(indicator in voice_text for indicator in language_indicators)
            
            if gender_match and language_match:
                filtered_voices.append((voice, score))
        
        # Use filtered voices if available, otherwise use all voices
        if filtered_voices:
            scored_voices = filtered_voices
            filter_msg = []
            if gender:
                filter_msg.append(f"'{gender}' gender")
            if language:
                filter_msg.append(f"'{language}' language")
            print(f"🎯 Filtered to {len(filtered_voices)} voices that match {', '.join(filter_msg)}")
        
        # Return the best voice
        best_voice = scored_voices[0][0]
        best_score = scored_voices[0][1]
        
        print(f"\n🎯 Selected voice: {best_voice['name']} (ID: {best_voice['voice_id']})")
        print(f"📊 Match score: {best_score}")
        print(f"📝 Description: {best_voice.get('description', 'No description')}")
        
        return best_voice['voice_id']

    def generate_speech(self, text, voice_id, output_file="output.mp3", stability=0.5, similarity_boost=0.5, 
                       tone=None, gender=None, background_music=None, language=None):
        """
        Generate speech from text with enhanced voice characteristics.
        
        Args:
            text (str): Text to convert to speech
            voice_id (str): ID of the voice to use
            output_file (str): Output filename
            stability (float): Voice stability (0.0 to 1.0)
            similarity_boost (float): Voice similarity boost (0.0 to 1.0)
            tone (str): Voice tone (friendly, professional, casual, dramatic, calm)
            gender (str): Voice gender (male, female, neutral)
            background_music (str): Background music style (none, ambient, upbeat, classical, electronic, acoustic)
            language (str): Language for the speech
        """
        url = f"{self.base_url}/text-to-speech/{voice_id}"
        
        # Adjust voice settings based on tone
        adjusted_stability = stability
        adjusted_similarity = similarity_boost
        
        if tone:
            tone_settings = {
                'friendly': {'stability': 0.4, 'similarity_boost': 0.7},
                'professional': {'stability': 0.8, 'similarity_boost': 0.6},
                'casual': {'stability': 0.3, 'similarity_boost': 0.5},
                'dramatic': {'stability': 0.2, 'similarity_boost': 0.8},
                'calm': {'stability': 0.7, 'similarity_boost': 0.4}
            }
            if tone.lower() in tone_settings:
                adjusted_stability = tone_settings[tone.lower()]['stability']
                adjusted_similarity = tone_settings[tone.lower()]['similarity_boost']
        
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": adjusted_stability,
                "similarity_boost": adjusted_similarity
            }
        }
        
        # Add language support if specified
        if language and language.lower() in self.language_codes:
            data["model_id"] = "eleven_multilingual_v2"  # Use multilingual model for non-English
            data["language"] = self.language_codes[language.lower()]
            print(f"🌍 Using multilingual model for {language.title()} language")
        elif language and language.lower() not in self.language_codes:
            print(f"⚠️  Warning: Language '{language}' not recognized. Using English model.")
        
        try:
            print(f"Generating speech for text: '{text[:50]}{'...' if len(text) > 50 else ''}'")
            print(f"Using voice ID: {voice_id}")
            if tone:
                print(f"Tone: {tone.title()}")
            if gender:
                print(f"Gender: {gender.title()}")
            if language:
                print(f"Language: {language.title()}")
            if background_music:
                print(f"Background music: {background_music.title()}")
            print("Processing...")
            
            response = requests.post(url, headers=self.headers, json=data)
            response.raise_for_status()
            
            # Save the audio file
            with open(output_file, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Speech generated successfully!")
            print(f"📁 Output file: {output_file}")
            print(f"📊 File size: {len(response.content)} bytes")
            
        except requests.exceptions.RequestException as e:
            print(f"Error generating speech: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_detail = e.response.json()
                    print(f"Error details: {error_detail}")
                except:
                    print(f"Response text: {e.response.text}")

    def generate_from_file(self, input_file, voice_id, output_file=None, **kwargs):
        """Generate speech from a text file with enhanced options."""
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                text = f.read().strip()
            
            if not text:
                print(f"Input file '{input_file}' is empty.")
                return
            
            if output_file is None:
                input_path = Path(input_file)
                output_file = f"{input_path.stem}_speech.mp3"
            
            self.generate_speech(text, voice_id, output_file, **kwargs)
            
        except FileNotFoundError:
            print(f"Input file '{input_file}' not found.")
        except Exception as e:
            print(f"Error reading input file: {e}")

    def get_background_music_file(self, style):
        """Get the path to the pre-loaded background music file for the given style."""
        if style == 'none' or style not in self.background_music_files:
            return None
        
        music_file = self.background_music_files[style]
        if music_file and os.path.exists(music_file):
            return music_file
        else:
            print(f"⚠️  Background music file not found: {music_file}")
            return None

    def _generate_simple_background_music(self, style, duration_seconds, output_file):
        """Generate simple background music using numpy when Music API is not available."""
        
        try:
            import numpy as np
            
            # Generate simple tones based on style
            sample_rate = 44100
            duration_samples = int(duration_seconds * sample_rate)
            
            if style == 'ambient':
                # Generate ambient pad sounds
                t = np.linspace(0, duration_seconds, duration_samples)
                # Create a simple chord progression
                freq1 = 220  # A3
                freq2 = 277  # C#4
                freq3 = 330  # E4
                
                wave1 = 0.1 * np.sin(2 * np.pi * freq1 * t)
                wave2 = 0.08 * np.sin(2 * np.pi * freq2 * t)
                wave3 = 0.06 * np.sin(2 * np.pi * freq3 * t)
                
                audio_data = wave1 + wave2 + wave3
                
            elif style == 'upbeat':
                # Generate simple beat pattern
                t = np.linspace(0, duration_seconds, duration_samples)
                beat_freq = 440  # A4
                # Create a simple rhythm
                beat_pattern = np.zeros_like(t)
                for i in range(0, len(t), int(sample_rate * 0.5)):  # Beat every 0.5 seconds
                    if i < len(beat_pattern):
                        beat_pattern[i:i+int(sample_rate*0.1)] = 0.3 * np.sin(2 * np.pi * beat_freq * t[i:i+int(sample_rate*0.1)])
                
                audio_data = beat_pattern
                
            elif style == 'classical':
                # Generate simple classical chord
                t = np.linspace(0, duration_seconds, duration_samples)
                # C major chord
                freq1 = 261.63  # C4
                freq2 = 329.63  # E4
                freq3 = 392.00  # G4
                
                wave1 = 0.1 * np.sin(2 * np.pi * freq1 * t)
                wave2 = 0.08 * np.sin(2 * np.pi * freq2 * t)
                wave3 = 0.06 * np.sin(2 * np.pi * freq3 * t)
                
                audio_data = wave1 + wave2 + wave3
                
            elif style == 'electronic':
                # Generate simple electronic synth
                t = np.linspace(0, duration_seconds, duration_samples)
                synth_freq = 440
                # Add some modulation
                modulation = 0.5 * np.sin(2 * np.pi * 2 * t)  # 2Hz modulation
                audio_data = 0.1 * np.sin(2 * np.pi * synth_freq * t + modulation)
                
            elif style == 'acoustic':
                # Generate simple acoustic guitar-like sound
                t = np.linspace(0, duration_seconds, duration_samples)
                freq1 = 220  # A3
                freq2 = 330  # E4
                
                wave1 = 0.08 * np.sin(2 * np.pi * freq1 * t)
                wave2 = 0.06 * np.sin(2 * np.pi * freq2 * t)
                
                audio_data = wave1 + wave2
                
            else:
                print(f"⚠️  Unknown style {style}, using ambient")
                audio_data = np.zeros(duration_samples)
            
            # Convert to 16-bit PCM
            audio_data = (audio_data * 32767).astype(np.int16)
            
            if AUDIO_MIXING_AVAILABLE:
                # Use pydub if available
                audio_segment = AudioSegment(
                    audio_data.tobytes(),
                    frame_rate=sample_rate,
                    sample_width=2,  # 16-bit
                    channels=1
                )
                audio_segment.export(output_file, format="mp3")
            else:
                # Save as WAV file directly using scipy
                from scipy.io import wavfile
                wavfile.write(output_file.replace('.mp3', '.wav'), sample_rate, audio_data)
                print(f"🎵 Generated simple {style} background music as WAV file")
                return True
            
            print(f"🎵 Generated simple {style} background music")
            return True
            
        except Exception as e:
            print(f"❌ Error generating simple background music: {e}")
            return False

    def _convert_mp3_to_wav(self, mp3_file, wav_file):
        """Convert MP3 to WAV using scipy."""
        try:
            from scipy.io import wavfile
            import subprocess
            import os
            
            # Try to use ffmpeg if available
            try:
                subprocess.run(['ffmpeg', '-i', mp3_file, '-y', wav_file], 
                             check=True, capture_output=True)
                return True
            except (subprocess.CalledProcessError, FileNotFoundError):
                # Fallback: try to read MP3 directly with scipy (may not work for all MP3s)
                try:
                    from scipy.io import wavfile
                    rate, data = wavfile.read(mp3_file)
                    wavfile.write(wav_file, rate, data)
                    return True
                except:
                    print("❌ Could not convert MP3 to WAV. Please install ffmpeg for better MP3 support.")
                    return False
                    
        except Exception as e:
            print(f"❌ Error converting MP3 to WAV: {e}")
            return False

    def _mix_audio_files(self, speech_file, music_file, output_file):
        """Mix speech and background music using multiple methods."""
        # Try FFmpeg first (most reliable)
        if self._mix_with_ffmpeg(speech_file, music_file, output_file):
            return True
        
        # Fallback to scipy
        if self._mix_with_scipy(speech_file, music_file, output_file):
            return True
        
        # Fallback to pure Python
        return self._mix_with_pure_python(speech_file, music_file, output_file)

    def _mix_with_ffmpeg(self, speech_file, music_file, output_file):
        """Mix audio using FFmpeg (most reliable method)."""
        try:
            import subprocess
            import os
            
            # Check if ffmpeg is available
            try:
                subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                return False
            
            # Mix with FFmpeg
            cmd = [
                'ffmpeg', '-i', speech_file, '-i', music_file,
                '-filter_complex', '[0]volume=0.8[speech];[1]volume=0.2[music];[speech][music]amix=inputs=2:duration=first',
                '-y', output_file
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"🎵 Mixed audio using FFmpeg")
                return True
            else:
                print(f"⚠️  FFmpeg failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"⚠️  FFmpeg error: {e}")
            return False

    def _mix_with_scipy(self, speech_file, music_file, output_file):
        """Mix audio using scipy (fallback method)."""
        try:
            from scipy.io import wavfile
            import numpy as np
            
            # Read the speech file
            speech_rate, speech_data = wavfile.read(speech_file)
            
            # Read the background music file
            music_rate, music_data = wavfile.read(music_file)
            
            # Ensure both files have the same sample rate
            if speech_rate != music_rate:
                print(f"⚠️  Sample rate mismatch: speech={speech_rate}Hz, music={music_rate}Hz")
                # Resample music to match speech rate
                from scipy import signal
                music_data = signal.resample(music_data, int(len(music_data) * speech_rate / music_rate))
                music_rate = speech_rate
            
            # Ensure both files have the same length
            min_length = min(len(speech_data), len(music_data))
            speech_data = speech_data[:min_length]
            music_data = music_data[:min_length]
            
            # Normalize the data to prevent clipping
            speech_data = speech_data.astype(np.float32)
            music_data = music_data.astype(np.float32)
            
            # Mix the audio (speech at 80% volume, background at 20%)
            speech_volume = speech_data * 0.8
            music_volume = music_data * 0.2
            
            # Combine the audio
            mixed_data = speech_volume + music_volume
            
            # Normalize to prevent clipping
            max_val = np.max(np.abs(mixed_data))
            if max_val > 1.0:
                mixed_data = mixed_data / max_val
            
            # Convert back to 16-bit PCM
            mixed_data = (mixed_data * 32767).astype(np.int16)
            
            # Save the mixed audio
            wavfile.write(output_file, speech_rate, mixed_data)
            print(f"🎵 Mixed audio using scipy")
            return True
            
        except Exception as e:
            print(f"⚠️  Scipy mixing error: {e}")
            return False

    def _mix_with_pure_python(self, speech_file, music_file, output_file):
        """Mix audio using pure Python (last resort)."""
        try:
            import wave
            import numpy as np
            
            # Read speech file
            with wave.open(speech_file, 'rb') as w1:
                speech_data = np.frombuffer(w1.readframes(w1.getnframes()), dtype=np.int16)
                speech_params = w1.getparams()
            
            # Read music file
            with wave.open(music_file, 'rb') as w2:
                music_data = np.frombuffer(w2.readframes(w2.getnframes()), dtype=np.int16)
            
            # Ensure same length
            min_length = min(len(speech_data), len(music_data))
            speech_data = speech_data[:min_length]
            music_data = music_data[:min_length]
            
            # Mix with volume control
            mixed = (0.8 * speech_data + 0.2 * music_data).astype(np.int16)
            
            # Write output
            with wave.open(output_file, 'wb') as out:
                out.setparams(speech_params)
                out.writeframes(mixed.tobytes())
            
            print(f"🎵 Mixed audio using pure Python")
            return True
            
        except Exception as e:
            print(f"❌ Pure Python mixing error: {e}")
            return False

    def add_background_music(self, speech_file, background_music_style, output_file):
        """Add background music to the speech file using pre-loaded files."""
        if background_music_style == 'none':
            # Just copy the speech file to output
            import shutil
            shutil.copy2(speech_file, output_file)
            print("🎵 No background music added")
            return True
        
        # Get the pre-loaded background music file
        music_file = self.get_background_music_file(background_music_style)
        if not music_file:
            print(f"⚠️  No background music file available for style: {background_music_style}")
            return False
        
        try:
            # Mix the audio files directly using librosa (no conversion needed)
            success = self._mix_audio_with_librosa(speech_file, music_file, output_file)
            return success
            
        except Exception as e:
            print(f"❌ Error adding background music: {e}")
            return False

    def _mix_audio_with_librosa(self, speech_file, music_file, output_file):
        """Mix audio using librosa and soundfile for high-quality processing."""
        try:
            import librosa
            import soundfile as sf
            import numpy as np
            
            # Load audio files directly (librosa handles MP3 natively)
            speech_audio, speech_sr = librosa.load(speech_file, sr=None)
            music_audio, music_sr = librosa.load(music_file, sr=None)
            
            # Calculate durations for debugging
            speech_duration = len(speech_audio) / speech_sr
            music_duration = len(music_audio) / music_sr
            print(f"🎵 Speech duration: {speech_duration:.2f}s, Music duration: {music_duration:.2f}s")
            
            # Resample music to match speech sample rate
            if music_sr != speech_sr:
                music_audio = librosa.resample(music_audio, orig_sr=music_sr, target_sr=speech_sr)
                music_sr = speech_sr
            
            # Ensure music matches speech duration exactly
            speech_length = len(speech_audio)
            
            if len(music_audio) < speech_length:
                # If music is shorter than speech, loop it to match speech length
                loops_needed = int(np.ceil(speech_length / len(music_audio)))
                music_audio = np.tile(music_audio, loops_needed)
            
            # Trim music to exact speech length
            music_audio = music_audio[:speech_length]
            
            # Ensure both arrays have exactly the same length
            assert len(speech_audio) == len(music_audio), f"Length mismatch: speech={len(speech_audio)}, music={len(music_audio)}"
            
            # Confirm final duration matching
            final_duration = len(speech_audio) / speech_sr
            print(f"🎵 Final mixed duration: {final_duration:.2f}s (perfectly matched)")
            
            # Mix the audio (speech at 80% volume, background at 20%)
            speech_volume = speech_audio * 0.8
            music_volume = music_audio * 0.2
            
            # Combine the audio
            mixed_audio = speech_volume + music_volume
            
            # Normalize to prevent clipping
            max_val = np.max(np.abs(mixed_audio))
            if max_val > 1.0:
                mixed_audio = mixed_audio / max_val
            
            # Save the mixed audio directly as MP3 using soundfile
            try:
                # Convert to 16-bit PCM for MP3 export
                mixed_audio_16bit = (mixed_audio * 32767).astype(np.int16)
                
                # Save directly as MP3 using soundfile
                sf.write(output_file, mixed_audio_16bit, speech_sr, format='MP3', subtype='MPEG_LAYER_III')
                print(f"🎵 Mixed audio using librosa and soundfile (direct MP3)")
                return True
                
            except Exception as e:
                print(f"⚠️  Direct MP3 save failed: {e}")
                # Fallback: save as WAV
                wav_output = output_file.replace('.mp3', '.wav')
                mixed_audio_16bit = (mixed_audio * 32767).astype(np.int16)
                sf.write(wav_output, mixed_audio_16bit, speech_sr)
                print(f"🎵 Saved mixed audio as WAV file (fallback)")
                return True
            
        except ImportError:
            print("⚠️  librosa or soundfile not available, falling back to scipy")
            return self._mix_audio_files(speech_file, music_file, output_file)
        except Exception as e:
            print(f"⚠️  librosa mixing error: {e}")
            return self._mix_audio_files(speech_file, music_file, output_file)

    
    def get_available_options(self):
        """Display available options for tone, gender, background music, and language."""
        print("\n🎭 Available Tones:")
        for tone in self.voice_characteristics['tone'].keys():
            print(f"  - {tone.title()}")
        
        print("\n👤 Available Genders:")
        for gender in self.voice_characteristics['gender'].keys():
            print(f"  - {gender.title()}")
        
        print("\n🎵 Available Background Music Styles:")
        for style in self.background_music_files.keys():
            if style != 'none':
                print(f"  - {style.title()}")
        print("  - None (no background music)")
        
        print("\n🌍 Available Languages:")
        for lang in list(self.language_codes.keys())[:20]:  # Show first 20 languages
            print(f"  - {lang.title()}")
        print(f"  ... and {len(self.language_codes) - 20} more languages")


def main():
    parser = argparse.ArgumentParser(description="Generate speech from text using ElevenLabs API with enhanced voice characteristics")
    parser.add_argument("--api-key", help="ElevenLabs API key (or set ELEVENLABS_API_KEY env var)")
    parser.add_argument("--text", help="Text to convert to speech")
    parser.add_argument("--file", help="Text file to convert to speech")
    parser.add_argument("--voice-id", help="Voice ID to use (optional - will auto-select if not provided)")
    parser.add_argument("--output", "-o", default="output.mp3", help="Output audio file (default: output.mp3)")
    parser.add_argument("--list-voices", action="store_true", help="List available voices")
    parser.add_argument("--stability", type=float, default=0.5, help="Voice stability (0.0-1.0, default: 0.5)")
    parser.add_argument("--similarity-boost", type=float, default=0.5, help="Voice similarity boost (0.0-1.0, default: 0.5)")
    
    # New enhanced voice characteristics
    parser.add_argument("--tone", 
                       help="Voice tone - can be any natural language description (e.g., 'warm and welcoming', 'authoritative and clear', 'relaxed and conversational', 'expressive and theatrical', 'soothing and peaceful') or use predefined options: friendly, professional, casual, dramatic, calm")
    parser.add_argument("--gender", choices=['male', 'female', 'neutral'], 
                       help="Voice gender (male, female, neutral)")
    parser.add_argument("--background-music", choices=['none', 'ambient', 'upbeat', 'classical', 'electronic', 'acoustic'], 
                       help="Background music style")
    parser.add_argument("--language", help="Language for speech (e.g., english, spanish, french, etc.)")
    parser.add_argument("--show-options", action="store_true", help="Show all available options for tone, gender, background music, and language")
    
    args = parser.parse_args()
    
    try:
        if args.show_options:
            # Show options without requiring API key
            generator = ElevenLabsSpeechGenerator.__new__(ElevenLabsSpeechGenerator)
            generator.voice_characteristics = {
                'tone': {
                    'friendly': ['warm', 'cheerful', 'upbeat'],
                    'professional': ['formal', 'authoritative', 'clear'],
                    'casual': ['relaxed', 'conversational', 'informal'],
                    'dramatic': ['expressive', 'theatrical', 'powerful'],
                    'calm': ['soothing', 'gentle', 'peaceful']
                },
                'gender': {
                    'male': ['masculine', 'deep', 'male'],
                    'female': ['feminine', 'soft', 'female'],
                    'neutral': ['androgynous', 'neutral', 'unisex']
                },
                'background_music': {
                    'none': 'no background music',
                    'ambient': 'subtle ambient sounds',
                    'upbeat': 'energetic background music',
                    'classical': 'classical music background',
                    'electronic': 'electronic music background',
                    'acoustic': 'acoustic music background'
                }
            }
            generator.language_codes = {
                'english': 'en', 'spanish': 'es', 'french': 'fr', 'german': 'de',
                'italian': 'it', 'portuguese': 'pt', 'russian': 'ru', 'japanese': 'ja',
                'korean': 'ko', 'chinese': 'zh', 'arabic': 'ar', 'hindi': 'hi',
                'dutch': 'nl', 'swedish': 'sv', 'norwegian': 'no', 'danish': 'da',
                'finnish': 'fi', 'polish': 'pl', 'czech': 'cs', 'hungarian': 'hu',
                'greek': 'el', 'turkish': 'tr', 'hebrew': 'he', 'thai': 'th',
                'vietnamese': 'vi', 'indonesian': 'id', 'malay': 'ms', 'tagalog': 'tl',
                'ukrainian': 'uk', 'bulgarian': 'bg', 'croatian': 'hr', 'serbian': 'sr',
                'slovak': 'sk', 'slovenian': 'sl', 'estonian': 'et', 'latvian': 'lv',
                'lithuanian': 'lt', 'romanian': 'ro', 'catalan': 'ca', 'basque': 'eu',
                'galician': 'gl'
            }
            generator.get_available_options()
            return
        
        generator = ElevenLabsSpeechGenerator(api_key=args.api_key)
        
        # Analyze tone if provided (do this first)
        analyzed_tone = None
        if args.tone:
            analyzed_tone = generator.analyze_tone_sentiment(args.tone)
            if not analyzed_tone:
                print("⚠️  Using default tone settings.")
        
        if args.list_voices:
            generator.list_voices(tone=analyzed_tone, gender=args.gender, language=args.language)
            return
        
        # Auto-select voice if not provided
        if not args.voice_id:
            print("🔍 No voice ID provided. Auto-selecting best voice based on your criteria...")
            voices = generator.get_voices()
            if not voices:
                print("No voices available. Please check your API key and connection.")
                return
            
            # Filter voices based on criteria (use analyzed tone)
            filtered_voices = generator.filter_voices(voices, analyzed_tone, args.gender, args.language)
            
            if not filtered_voices:
                print("⚠️  No voices match your criteria. Using any available voice...")
                filtered_voices = voices
            
            # Select the best voice
            args.voice_id = generator.select_best_voice(filtered_voices, analyzed_tone, args.gender, args.language)
            
            if not args.voice_id:
                print("Could not select a voice. Please try with --list-voices to see available options.")
                return
        
        # Prepare enhanced parameters
        enhanced_params = {
            'stability': args.stability,
            'similarity_boost': args.similarity_boost,
            'tone': analyzed_tone,
            'gender': args.gender,
            'background_music': args.background_music,
            'language': args.language
        }
        
        # Generate speech first
        temp_output = "temp_speech.mp3" if args.background_music and args.background_music != 'none' else args.output
        
        # If we're adding background music and pydub is not available, output as WAV
        if args.background_music and args.background_music != 'none' and not AUDIO_MIXING_AVAILABLE:
            if not args.output.endswith('.wav'):
                args.output = args.output.replace('.mp3', '.wav')
        
        if args.file:
            generator.generate_from_file(
                args.file, 
                args.voice_id, 
                temp_output,
                **enhanced_params
            )
        elif args.text:
            generator.generate_speech(
                args.text, 
                args.voice_id, 
                temp_output,
                **enhanced_params
            )
        
        # Add background music if requested
        if args.background_music and args.background_music != 'none':
            if generator.add_background_music(temp_output, args.background_music, args.output):
                # Clean up temp file
                try:
                    os.remove(temp_output)
                except:
                    pass
                print(f"🎵 Final output with background music: {args.output}")
            else:
                # If background music failed, just rename temp file to output
                try:
                    os.rename(temp_output, args.output)
                    print(f"📁 Speech saved as: {args.output}")
                except:
                    pass
        else:
            # No background music requested, just rename temp file to output
            try:
                os.rename(temp_output, args.output)
                print(f"📁 Speech saved as: {args.output}")
            except:
                pass
    
    except ValueError as e:
        print("\nTo get an API key:")
        print("1. Visit https://elevenlabs.io")
        print("2. Sign up for an account")
        print("3. Get your API key from the dashboard")
        print("4. Set it as an environment variable: export ELEVENLABS_API_KEY='your-key'")
        print("   or pass it with --api-key")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
