import os
from behave import given, when, then
from scanner import analizar_archivo

TEST_DIR = os.path.join(os.path.dirname(__file__), "..", "bdd_temp")

@given('un archivo llamado "{file_name}" con el texto "{content}"')
def step_impl_given_file(context, file_name, content):
    os.makedirs(TEST_DIR, exist_ok=True)
    context.file_path = os.path.join(TEST_DIR, file_name)
    with open(context.file_path, "w") as f:
        f.write(content)

@when('ejecuto el análisis sobre el archivo')
def step_impl_when_analyze(context):
    context.result = analizar_archivo(context.file_path)

@then('el sistema debe clasificarlo como "{expected_type}"')
def step_impl_then_detect(context, expected_type):
    assert context.result is not None, "El sistema no detectó ninguna amenaza"
    assert context.result["tipo"] == expected_type, f"Se esperaba {expected_type} pero se obtuvo {context.result['tipo']}"
    
    # Cleanup
    os.remove(context.file_path)

@then('el sistema debe clasificarlo como seguro')
def step_impl_then_safe(context):
    assert context.result is None, f"Se esperaba archivo seguro, pero se detectó: {context.result}"
    
    # Cleanup
    os.remove(context.file_path)
