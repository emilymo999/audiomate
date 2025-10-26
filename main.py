from llm import ScriptGenerator
from speech_generator import ElevenLabsSpeechGenerator
import os

user_inputs = {
    "product_name": "ElevenLabs",
    "product_details": (
        "ElevenLabs is a generative AI voice platform that brings text to life with ultra-realistic voices. "
        "It lets creators, studios, and developers produce humanlike narration, character dialogue, and ads in seconds."
    ),
    "company_context": (
        "ElevenLabs believes storytelling should sound as real as it feels. "
        "Its mission is to make powerful voice technology accessible to every creator, "
        "turning imagination into sound."
    ),
    "target_audience": "Content creators and developers looking for high-quality synthetic voices",
    "distribution_method": "Radio",
    "desired_length": "10",
    "example_output": (
        "Your story deserves a voice. ElevenLabs turns your words into lifelike sound — ready for any audience, in any language."
    ), 
    "language": "english"
}

script_generator = ScriptGenerator(user_inputs)
script = script_generator.generate_script()

speech_generator = ElevenLabsSpeechGenerator(api_key=os.getenv('ELEVENLABS_API_KEY'))

tone = "dramatic"
gender = "male"
background_music = "electronic"
language = "english" 

speech_generator.generate_speech(
    script, 
    tone=tone,
    gender=gender,
    background_music=background_music,
    language=language
)

#THESE SETTINGS
# tone = "dramatic"
# gender = "male"
# background_music = "electronic"

# user_inputs = {
#     "product_name": "ElevenLabs",
#     "product_details": (
#         "ElevenLabs is a generative AI voice platform that brings text to life with ultra-realistic voices. "
#         "It lets creators, studios, and developers produce humanlike narration, character dialogue, and ads in seconds."
#     ),
#     "company_context": (
#         "ElevenLabs believes storytelling should sound as real as it feels. "
#         "Its mission is to make powerful voice technology accessible to every creator, "
#         "turning imagination into sound."
#     ),
#     "target_audience": "Content creators and developers looking for high-quality synthetic voices",
#     "distribution_method": "Radio",
#     "desired_length": "60",
#     "example_output": (
#         "Your story deserves a voice. ElevenLabs turns your words into lifelike sound — ready for any audience, in any language."
#     )
# }

#try english, chinese, tamil