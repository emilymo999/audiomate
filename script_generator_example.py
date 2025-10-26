from llm import ScriptGenerator

inputs = {
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
    "desired_length": "60",
    "example_output": (
        "Your story deserves a voice. ElevenLabs turns your words into lifelike sound — ready for any audience, in any language."
    ),
    "language": "chinese"
}

script_generator = ScriptGenerator(inputs)
script = script_generator.generate_script()
print(script)


# inputs = {
#     "product_name": "TideGuard",
#     "product_details": (
#         "TideGuard is an AI fraud detection platform built for small businesses. "
#         "It monitors payment behavior in real time and blocks suspicious transactions "
#         "before they cause harm."
#     ),
#     "company_context": (
#         "Tide values trust, security, and simplicity. "
#         "Its mission is to help small business owners feel confident that their payments are safe."
#     ),
#     "target_audience": "Small business owners who use digital payment systems",
#     "distribution_method": "Spotify",
#     "desired_length": "15",
#     "example_output": (
#         "Running a small business means wearing a dozen hats — and the numbers don’t always play nice. Ever stare at your sales report and wonder which products actually move the needle, or why cash gets tight two weeks after a big weekend? TideInsights takes the guesswork out of growth. Our AI watches your transactions, categorizes revenue and expenses automatically, and highlights the patterns that matter — the customers worth courting, the slow-moving inventory draining cash, and the seasonal shifts you can plan for. Instead of drowning in spreadsheets, you get simple, actionable recommendations: when to reorder, which promotion to double down on, and how to smooth cash flow before it becomes a problem. Tide built this tool for owners who want to spend less time troubleshooting numbers and more time building the business they imagined. It plugs into the systems you already use, summarizes your financial picture in plain language, and surfaces the three things you should do this week to move forward. Try TideInsights free for 30 days and see the story behind your cash — clearer decisions, calmer days, smarter growth. Sign up at TideGuard.com/TideInsights."
#     )
# }

# inputs = {
#     "product_name": "ShopIQ",
#     "product_details": (
#         "ShopIQ is an AI retail analytics platform that forecasts demand, optimizes inventory, "
#         "and reveals which products will fly off the shelves next season."
#     ),
#     "company_context": (
#         "ShopIQ believes that smart decisions start with better insights. "
#         "It empowers local retailers with the same predictive tools used by enterprise brands."
#     ),
#     "target_audience": "Brick-and-mortar store owners looking to improve sales forecasting",
#     "distribution_method": "LinkedIn audio ads",
#     "desired_length": "25",
#     "example_output": (
#         "Your shelves shouldn’t guess — they should know. ShopIQ predicts what your customers want before they do."
#     )
# }