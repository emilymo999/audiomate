from openai import OpenAI

class ScriptGenerator:
    def __init__(self, inputs: dict, model="gpt-4o"):
        self.client = OpenAI()
        self.model = model
        self.inputs = inputs
    
    def generate_script(self):
        prompt_template = """
        You are an expert creative copywriter specializing in high-conversion *audio advertisements*. 
        Your task is to write a compelling, natural-sounding script for an audio ad.

        ### INSTRUCTIONS:
        1. The ad must centralize around the product {product_name} and highlight the unique value proposition highlighted in the following product details:
        <product_details>
        {product_details}
        </product_details>

        2. Align the message of the ad with company values and marketing message highlighted in the following company details:
        <company_context>
        {company_context}
        </company_context>

        3. Tailor the ad to the {target_audience} so that the product speaks directly to their motivations and lifestyle

        4. Adapt the language to fit {distribution_method} as the distribution platform (e.g., more casual for Spotify, more formal for traditional radio)

        5. You must ensure that the pacing fits the target duration of {desired_length} seconds (e.g., 15 seconds ≈ ~35 words, 30 seconds ≈ ~75 words)

        6. The script should be in the following language: {language}

        ### EXAMPLE SCRIPT: 
        The following script is an example of a previous ad produced for the company. 
        You should match the tone and energy of the example, but do NOT copy it's details in terms of length, product, etc.
        
        <example_script>
        {example_output}
        </example_script>

        ### OUTPUT FORMAT:
        Return only the spoken script as plain text.
        You may use the following tags to enhance emotional expression: 
        - [laughs], [laughs harder], [starts laughing], [wheezing]
        - [whispers]
        - [sighs], [exhales]
        - [sarcastic], [curious], [excited], [crying], [snorts], [mischievously]

        Punctuation should be intentional to enhance the delivery of the script.
        - Ellipses (…) add pauses and weight
        - Capitalization increases emphasis
        - Standard punctuation provides natural speech rhythm

        Do not include any of the following:
        - Speaker identifiers (e.g., “Narrator:”, “Voiceover:”)
        - Audio or music cues (e.g., “[Music fades in]”, “(cheerful tone)”)
        """

        prompt = prompt_template.format(**self.inputs)
        response = self.client.responses.create(
            model=self.model,
            input=prompt
        )
        return response.output_text