"""
Linear Search Algorithm Implementation

Linear Search (also called Sequential Search) is the simplest searching algorithm.
It searches for an element in a list by checking every element in sequence until
the desired element is found or the end of the list is reached.

Key characteristics:
- Simple and straightforward implementation
- Works on both sorted and unsorted arrays
- No preprocessing required
- Searches element by element sequentially

Time Complexity:
- Best Case: O(1) - element found at the first position
- Average Case: O(n) - element found at middle position
- Worst Case: O(n) - element at the end or not present

Space Complexity: O(1) - only uses constant extra space

Use cases:
- Small datasets
- Unsorted arrays
- When simplicity is preferred over efficiency
- One-time searches where preprocessing cost isn't justified
"""

def linear_search(arr, target):
    """
    Searches for a target element in an array using linear search.
    
    Args:
        arr (list): List of elements to search in
        target: Element to search for
        
    Returns:
        int: Index of the target element if found, -1 otherwise
        
    Examples:
        >>> linear_search([64, 34, 25, 12, 22, 11, 90], 25)
        2
        
        >>> linear_search([5, 2, 8, 1, 9], 8)
        2
        
        >>> linear_search([1, 2, 3, 4, 5], 6)
        -1
        
        >>> linear_search([], 5)
        -1
    """
    # Iterate through each element in the array
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Return index if element found
    
    return -1  # Return -1 if element not found


def linear_search_all_indices(arr, target):
    """
    Finds all indices where the target element occurs in the array.
    
    Args:
        arr (list): List of elements to search in
        target: Element to search for
        
    Returns:
        list: List of all indices where target is found
        
    Examples:
        >>> linear_search_all_indices([1, 3, 2, 3, 5, 3], 3)
        [1, 3, 5]
        
        >>> linear_search_all_indices([1, 2, 3, 4, 5], 6)
        []
    """
    indices = []
    
    for i in range(len(arr)):
        if arr[i] == target:
            indices.append(i)
    
    return indices


def linear_search_verbose(arr, target):
    """
    Linear search with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of elements to search in
        target: Element to search for
        
    Returns:
        int: Index of target element if found, -1 otherwise
    """
    print(f"Starting Linear Search for target: {target}")
    print(f"Array: {arr}")
    print("-" * 50)
    
    if len(arr) == 0:
        print("Array is empty, element not found!")
        return -1
    
    for i in range(len(arr)):
        print(f"Step {i + 1}: Checking arr[{i}] = {arr[i]}")
        
        if arr[i] == target:
            print(f"  ✓ Found! Target {target} found at index {i}")
            return i
        else:
            print(f"  ✗ Not a match, continue searching...")
    
    print(f"Target {target} not found in the array")
    return -1


def linear_search_recursive(arr, target, index=0):
    """
    Recursive implementation of linear search.
    
    Args:
        arr (list): List of elements to search in
        target: Element to search for
        index (int): Current index being checked (used in recursion)
        
    Returns:
        int: Index of target element if found, -1 otherwise
    """
    # Base case: reached end of array
    if index >= len(arr):
        return -1
    
    # Base case: found the target
    if arr[index] == target:
        return index
    
    # Recursive case: search in the remaining array
    return linear_search_recursive(arr, target, index + 1)


def linear_search_with_condition(arr, condition_func):
    """
    Linear search for the first element that satisfies a given condition.
    
    Args:
        arr (list): List of elements to search in
        condition_func (function): Function that returns True for the desired element
        
    Returns:
        int: Index of first element satisfying the condition, -1 if none found
        
    Examples:
        >>> linear_search_with_condition([1, 3, 5, 8, 12], lambda x: x > 7)
        3
        
        >>> linear_search_with_condition([1, 3, 5, 7, 9], lambda x: x % 2 == 0)
        -1
    """
    for i in range(len(arr)):
        if condition_func(arr[i]):
            return i
    
    return -1


def linear_search_objects(objects, key_func, target_value):
    """
    Linear search in a list of objects using a key function.
    
    Args:
        objects (list): List of objects to search in
        key_func (function): Function to extract the key from each object
        target_value: Value to search for
        
    Returns:
        int: Index of object with matching key value, -1 if not found
    """
    for i in range(len(objects)):
        if key_func(objects[i]) == target_value:
            return i
    
    return -1


def linear_search_min_max(arr):
    """
    Find both minimum and maximum elements in a single pass using linear search approach.
    
    Args:
        arr (list): List of comparable elements
        
    Returns:
        tuple: (min_element, max_element, min_index, max_index) or (None, None, -1, -1) for empty array
    """
    if not arr:
        return None, None, -1, -1
    
    min_val = max_val = arr[0]
    min_idx = max_idx = 0
    
    for i in range(1, len(arr)):
        if arr[i] < min_val:
            min_val = arr[i]
            min_idx = i
        elif arr[i] > max_val:
            max_val = arr[i]
            max_idx = i
    
    return min_val, max_val, min_idx, max_idx


# Example usage and test cases
if __name__ == "__main__":
    # Test cases for basic linear search
    test_cases = [
        ([64, 34, 25, 12, 22, 11, 90], 25, 2),
        ([5, 2, 8, 1, 9], 8, 2),
        ([1, 2, 3, 4, 5], 6, -1),
        ([1, 2, 3, 4, 5], 1, 0),
        ([1, 2, 3, 4, 5], 5, 4),
        ([], 5, -1),
        ([42], 42, 0),
        ([1, 1, 1, 1], 1, 0),
    ]
    
    print("=== Linear Search Test Cases ===\n")
    
    for i, (arr, target, expected) in enumerate(test_cases):
        print(f"Test Case {i + 1}:")
        print(f"Array: {arr}")
        print(f"Target: {target}")
        result = linear_search(arr, target)
        print(f"Result: {result} (Expected: {expected})")
        print(f"Status: {'✓ PASS' if result == expected else '✗ FAIL'}")
        print()
    
    # Test finding all indices
    print("=== Linear Search All Indices ===")
    test_array = [1, 3, 2, 3, 5, 3, 7, 3]
    target = 3
    print(f"Array: {test_array}")
    print(f"Target: {target}")
    indices = linear_search_all_indices(test_array, target)
    print(f"All indices: {indices}")
    
    # Test recursive version
    print("\n=== Recursive Linear Search ===")
    test_array = [10, 23, 45, 70, 11, 15]
    target = 70
    print(f"Array: {test_array}")
    print(f"Target: {target}")
    result = linear_search_recursive(test_array, target)
    print(f"Result: {result}")
    
    # Test with condition
    print("\n=== Linear Search with Condition ===")
    test_array = [1, 3, 5, 8, 12, 16]
    print(f"Array: {test_array}")
    print("Searching for first even number...")
    result = linear_search_with_condition(test_array, lambda x: x % 2 == 0)
    if result != -1:
        print(f"First even number {test_array[result]} found at index {result}")
    else:
        print("No even number found")
    
    # Test with objects
    print("\n=== Linear Search with Objects ===")
    
    class Person:
        def __init__(self, name, age):
            self.name = name
            self.age = age
        
        def __str__(self):
            return f"{self.name}({self.age})"
    
    people = [
        Person("Alice", 25),
        Person("Bob", 30),
        Person("Charlie", 35),
        Person("Diana", 28)
    ]
    
    print(f"People: {[str(p) for p in people]}")
    result = linear_search_objects(people, lambda p: p.name, "Charlie")
    if result != -1:
        print(f"Found Charlie at index {result}")
    else:
        print("Charlie not found")
    
    # Test min/max finder
    print("\n=== Find Min/Max in One Pass ===")
    test_array = [64, 34, 25, 12, 22, 11, 90]
    print(f"Array: {test_array}")
    min_val, max_val, min_idx, max_idx = linear_search_min_max(test_array)
    print(f"Minimum: {min_val} at index {min_idx}")
    print(f"Maximum: {max_val} at index {max_idx}")
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [64, 34, 25, 12, 22, 11, 90]
    target = 22
    linear_search_verbose(sample_array, target)