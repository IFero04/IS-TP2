def str_to_ascii(input_string):
    ascii_codes = [ord(char) for char in input_string]
    ascii_string = ''.join(map(str, ascii_codes))

    return ascii_string
