from pyzxcvbn import zxcvbn

def check_password_strength(password):
    try:
        strength_result = zxcvbn(password)
        return strength_result['score'], strength_result['feedback']['suggestions']
    except Exception as e:
        return 0, [str(e)]
