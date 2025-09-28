"""
Radix Sort Algorithm Implementation

Radix Sort is a non-comparative sorting algorithm that sorts data with integer keys by
grouping keys by individual digits that share the same significant position and value.
It was originally used to sort punched cards in early computing systems.

Key characteristics:
- Non-comparative sorting algorithm
- Stable sorting algorithm
- Works with integers and can be adapted for strings
- Uses counting sort as a subroutine for each digit

Time Complexity:
- Best Case: O(d × (n + k)) where d = number of digits, k = range of digit (0-9)
- Average Case: O(d × (n + k))
- Worst Case: O(d × (n + k))

For integers: O(d × n) where d is the number of digits in the maximum number

Space Complexity: O(n + k) where k is the range of each digit (10 for decimal)

Stability: Stable - maintains relative order of equal elements
"""

def radix_sort(arr):
    """
    Sorts an array of non-negative integers using radix sort.
    
    Args:
        arr (list): List of non-negative integers to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> radix_sort([170, 45, 75, 90, 2, 802, 24, 66])
        [2, 24, 45, 66, 75, 90, 170, 802]
        
        >>> radix_sort([5, 2, 8, 1, 9])
        [1, 2, 5, 8, 9]
        
        >>> radix_sort([1])
        [1]
        
        >>> radix_sort([])
        []
    """
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    
    # Handle edge cases
    if len(arr_copy) <= 1:
        return arr_copy
    
    # Check for non-negative integers
    if any(x < 0 for x in arr_copy):
        raise ValueError("Radix sort only works with non-negative integers")
    
    def counting_sort_for_radix(arr, exp):
        """
        A function to do counting sort of arr[] according to the digit represented by exp.
        
        Args:
            arr (list): Array to be sorted
            exp (int): The exponent representing which digit to sort by (1, 10, 100, ...)
        """
        n = len(arr)
        output = [0] * n  # Output array
        count = [0] * 10  # Count array for digits 0-9
        
        # Store count of occurrences of each digit
        for i in range(n):
            index = (arr[i] // exp) % 10
            count[index] += 1
        
        # Change count[i] so that count[i] contains actual position of this digit in output[]
        for i in range(1, 10):
            count[i] += count[i - 1]
        
        # Build the output array by processing elements from right to left
        # This maintains stability of the sort
        i = n - 1
        while i >= 0:
            index = (arr[i] // exp) % 10
            output[count[index] - 1] = arr[i]
            count[index] -= 1
            i -= 1
        
        # Copy the output array to arr[], so that arr[] contains sorted numbers
        for i in range(n):
            arr[i] = output[i]
    
    # Find the maximum number to know number of digits
    max_num = max(arr_copy)
    
    # Do counting sort for every digit
    # exp is 10^i where i is current digit number
    exp = 1
    while max_num // exp > 0:
        counting_sort_for_radix(arr_copy, exp)
        exp *= 10
    
    return arr_copy


def radix_sort_verbose(arr):
    """
    Radix sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of non-negative integers to be sorted
        
    Returns:
        list: Sorted list
    """
    arr_copy = arr.copy()
    
    print(f"Starting Radix Sort with array: {arr_copy}")
    print("-" * 60)
    
    if len(arr_copy) <= 1:
        print("Array has 0 or 1 element, already sorted!")
        return arr_copy
    
    if any(x < 0 for x in arr_copy):
        print("Error: Radix sort only works with non-negative integers")
        return arr_copy
    
    def counting_sort_verbose(arr, exp, digit_position):
        """Counting sort with verbose output for radix sort"""
        n = len(arr)
        output = [0] * n
        count = [0] * 10
        
        print(f"\n  Digit Position: {digit_position} (sorting by digit at position 10^{int(math.log10(exp)) if exp > 0 else 0})")
        
        # Extract digits for visualization
        digits = [(arr[i] // exp) % 10 for i in range(n)]
        print(f"  Digits to sort by: {digits}")
        print(f"  Original array:    {arr}")
        
        # Count occurrences of each digit
        for i in range(n):
            index = (arr[i] // exp) % 10
            count[index] += 1
        
        print(f"  Digit counts: {dict(enumerate(count))}")
        
        # Calculate cumulative counts
        for i in range(1, 10):
            count[i] += count[i - 1]
        
        print(f"  Cumulative counts: {dict(enumerate(count))}")
        
        # Build output array (from right to left for stability)
        i = n - 1
        while i >= 0:
            index = (arr[i] // exp) % 10
            output[count[index] - 1] = arr[i]
            count[index] -= 1
            i -= 1
        
        # Copy back to original array
        for i in range(n):
            arr[i] = output[i]
        
        print(f"  After sorting:     {arr}")
    
    # Find maximum number to determine number of digits
    max_num = max(arr_copy)
    num_digits = len(str(max_num))
    
    print(f"Maximum number: {max_num}")
    print(f"Number of digits: {num_digits}")
    print(f"Will perform {num_digits} passes")
    
    # Perform counting sort for each digit
    exp = 1
    digit_pos = 1
    
    while max_num // exp > 0:
        print(f"\nPass {digit_pos}: Sorting by digit at position {digit_pos} (from right)")
        counting_sort_verbose(arr_copy, exp, digit_pos)
        exp *= 10
        digit_pos += 1
    
    print(f"\nFinal sorted array: {arr_copy}")
    return arr_copy


def radix_sort_strings(strings):
    """
    Radix sort adaptation for strings of equal length.
    
    Args:
        strings (list): List of strings of equal length to be sorted
        
    Returns:
        list: Sorted list of strings
    """
    if not strings:
        return strings
    
    # Check if all strings have the same length
    length = len(strings[0])
    if not all(len(s) == length for s in strings):
        raise ValueError("All strings must have the same length for radix sort")
    
    strings_copy = strings.copy()
    
    # Sort from rightmost character to leftmost character
    for pos in range(length - 1, -1, -1):
        # Use counting sort for each character position
        strings_copy = counting_sort_strings(strings_copy, pos)
    
    return strings_copy


def counting_sort_strings(strings, pos):
    """Counting sort for strings based on character at specific position"""
    n = len(strings)
    output = [''] * n
    count = [0] * 256  # ASCII character range
    
    # Count occurrences of each character
    for string in strings:
        count[ord(string[pos])] += 1
    
    # Calculate cumulative counts
    for i in range(1, 256):
        count[i] += count[i - 1]
    
    # Build output array
    i = n - 1
    while i >= 0:
        output[count[ord(strings[i][pos])] - 1] = strings[i]
        count[ord(strings[i][pos])] -= 1
        i -= 1
    
    return output


# Example usage and test cases
if __name__ == "__main__":
    import math
    
    # Test cases for integers
    test_arrays = [
        [170, 45, 75, 90, 2, 802, 24, 66],
        [5, 2, 8, 1, 9],
        [432, 8, 530, 90, 88, 231, 11, 45, 677, 199],
        [1, 2, 3, 4, 5],  # Already sorted
        [5, 4, 3, 2, 1],  # Reverse sorted
        [1],              # Single element
        [],               # Empty array
        [3, 3, 3, 3],     # All same elements
        [0, 0, 1, 0],     # With zeros
    ]
    
    print("=== Radix Sort Test Cases (Integers) ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        try:
            result = radix_sort(test_arr)
            print(f"Sorted:   {result}")
        except ValueError as e:
            print(f"Error:    {e}")
        print()
    
    # Test string sorting
    print("=== Radix Sort Test Cases (Strings) ===")
    string_arrays = [
        ["abc", "def", "aab", "xyz"],
        ["cat", "dog", "bat", "rat"],
        ["aaa", "bbb", "ccc"],
    ]
    
    for i, test_strings in enumerate(string_arrays):
        print(f"String Test {i + 1}:")
        print(f"Original: {test_strings}")
        result = radix_sort_strings(test_strings)
        print(f"Sorted:   {result}")
        print()
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [170, 45, 75, 90, 2, 802, 24, 66]
    radix_sort_verbose(sample_array)