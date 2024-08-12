def find_closest(choices, search_num):
    return choices[
        min(
            range(len(choices)),
            key = lambda i: abs(choices[i] - search_num)
        )
    ]
