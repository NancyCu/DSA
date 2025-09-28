"""
Binary Search Algorithm Implementation

Binary Search is an efficient searching algorithm that works on sorted arrays.
It uses a divide-and-conquer approach to repeatedly divide the search interval in half.
If the value being searched is less than the item in the middle of the interval,
it narrows the interval to the lower half; otherwise, it narrows to the upper half.

Key characteristics:
- Requires sorted array as prerequisite
- Uses divide-and-conquer approach
- Much more efficient than linear search for large datasets
- Can be implemented iteratively or recursively

Time Complexity:
- Best Case: O(1) - element found at middle position
- Average Case: O(log n)
- Worst Case: O(log n) - element at the end or not present

Space Complexity: 
- Iterative: O(1)
- Recursive: O(log n) due to recursion stack

Prerequisites: Array must be sorted in ascending order
"""

def binary_search(arr, target):
    """
    Searches for a target element in a sorted array using binary search.
    
    Args:
        arr (list): Sorted list of comparable elements
        target: Element to search for
        
    Returns:
        int: Index of the target element if found, -1 otherwise
        
    Examples:
        >>> binary_search([1, 3, 5, 7, 9, 11, 13], 7)
        3
        
        >>> binary_search([2, 4, 6, 8, 10, 12], 10)
        4
        
        >>> binary_search([1, 2, 3, 4, 5], 6)
        -1
        
        >>> binary_search([], 5)
        -1
    """
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        # Calculate middle index (avoiding overflow)
        mid = left + (right - left) // 2
        
        # Check if target is at mid
        if arr[mid] == target:
            return mid
        
        # If target is smaller, ignore right half
        elif arr[mid] > target:
            right = mid - 1
        
        # If target is larger, ignore left half
        else:
            left = mid + 1
    
    # Element not found
    return -1


def binary_search_recursive(arr, target, left=None, right=None):
    """
    Recursive implementation of binary search.
    
    Args:
        arr (list): Sorted list of comparable elements
        target: Element to search for
        left (int): Left boundary of search (optional, defaults to 0)
        right (int): Right boundary of search (optional, defaults to len(arr)-1)
        
    Returns:
        int: Index of target element if found, -1 otherwise
    """
    # Initialize bounds on first call
    if left is None:
        left = 0
    if right is None:
        right = len(arr) - 1
    
    # Base case: invalid range
    if left > right:
        return -1
    
    # Calculate middle index
    mid = left + (right - left) // 2
    
    # Base case: found target
    if arr[mid] == target:
        return mid
    
    # Recursive cases
    elif arr[mid] > target:
        # Search left half
        return binary_search_recursive(arr, target, left, mid - 1)
    else:
        # Search right half
        return binary_search_recursive(arr, target, mid + 1, right)


def binary_search_verbose(arr, target):
    """
    Binary search with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): Sorted list of comparable elements
        target: Element to search for
        
    Returns:
        int: Index of target element if found, -1 otherwise
    """
    print(f"Starting Binary Search for target: {target}")
    print(f"Array: {arr}")
    print("-" * 60)
    
    if len(arr) == 0:
        print("Array is empty, element not found!")
        return -1
    
    # Check if array is sorted
    if not all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1)):
        print("⚠️  Warning: Array doesn't appear to be sorted!")
        print("Binary search requires a sorted array to work correctly.")
    
    left = 0
    right = len(arr) - 1
    step = 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        print(f"Step {step}:")
        print(f"  Search range: [{left}, {right}]")
        print(f"  Middle index: {mid}")
        print(f"  Middle value: arr[{mid}] = {arr[mid]}")
        print(f"  Comparing {arr[mid]} with target {target}")
        
        if arr[mid] == target:
            print(f"  ✓ Found! Target {target} found at index {mid}")
            return mid
        elif arr[mid] > target:
            print(f"  {arr[mid]} > {target}, search left half")
            right = mid - 1
        else:
            print(f"  {arr[mid]} < {target}, search right half")
            left = mid + 1
        
        print(f"  New search range: [{left}, {right}]")
        print()
        step += 1
    
    print(f"Target {target} not found in the array")
    return -1


def binary_search_leftmost(arr, target):
    """
    Find the leftmost (first) occurrence of target in a sorted array with duplicates.
    
    Args:
        arr (list): Sorted list that may contain duplicates
        target: Element to search for
        
    Returns:
        int: Index of first occurrence of target, -1 if not found
    """
    left = 0
    right = len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            result = mid  # Record this position
            right = mid - 1  # Continue searching left
        elif arr[mid] > target:
            right = mid - 1
        else:
            left = mid + 1
    
    return result


def binary_search_rightmost(arr, target):
    """
    Find the rightmost (last) occurrence of target in a sorted array with duplicates.
    
    Args:
        arr (list): Sorted list that may contain duplicates
        target: Element to search for
        
    Returns:
        int: Index of last occurrence of target, -1 if not found
    """
    left = 0
    right = len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            result = mid  # Record this position
            left = mid + 1  # Continue searching right
        elif arr[mid] > target:
            right = mid - 1
        else:
            left = mid + 1
    
    return result


def binary_search_range(arr, target):
    """
    Find the range [first_index, last_index] of target in a sorted array.
    
    Args:
        arr (list): Sorted list that may contain duplicates
        target: Element to search for
        
    Returns:
        tuple: (first_index, last_index) or (-1, -1) if not found
    """
    first = binary_search_leftmost(arr, target)
    if first == -1:
        return (-1, -1)
    
    last = binary_search_rightmost(arr, target)
    return (first, last)


def binary_search_insertion_point(arr, target):
    """
    Find the insertion point for target in a sorted array to maintain sort order.
    
    Args:
        arr (list): Sorted list
        target: Element to find insertion point for
        
    Returns:
        int: Index where target should be inserted
    """
    left = 0
    right = len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left


def binary_search_2d_matrix(matrix, target):
    """
    Search for target in a sorted 2D matrix where:
    - Each row is sorted from left to right
    - First element of each row is greater than last element of previous row
    
    Args:
        matrix (list of lists): 2D matrix
        target: Element to search for
        
    Returns:
        tuple: (row, col) if found, (-1, -1) if not found
    """
    if not matrix or not matrix[0]:
        return (-1, -1)
    
    rows = len(matrix)
    cols = len(matrix[0])
    
    # Treat 2D matrix as 1D array and apply binary search
    left = 0
    right = rows * cols - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        # Convert 1D index back to 2D coordinates
        row = mid // cols
        col = mid % cols
        mid_val = matrix[row][col]
        
        if mid_val == target:
            return (row, col)
        elif mid_val < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return (-1, -1)


# Example usage and test cases
if __name__ == "__main__":
    # Test cases for basic binary search
    test_cases = [
        ([1, 3, 5, 7, 9, 11, 13], 7, 3),
        ([2, 4, 6, 8, 10, 12], 10, 4),
        ([1, 2, 3, 4, 5], 6, -1),
        ([1, 2, 3, 4, 5], 1, 0),
        ([1, 2, 3, 4, 5], 5, 4),
        ([], 5, -1),
        ([42], 42, 0),
        ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 0),
        ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10, 9),
    ]
    
    print("=== Binary Search Test Cases ===\n")
    
    for i, (arr, target, expected) in enumerate(test_cases):
        print(f"Test Case {i + 1}:")
        print(f"Array: {arr}")
        print(f"Target: {target}")
        result = binary_search(arr, target)
        print(f"Result: {result} (Expected: {expected})")
        print(f"Status: {'✓ PASS' if result == expected else '✗ FAIL'}")
        print()
    
    # Test recursive version
    print("=== Recursive Binary Search ===")
    test_array = [1, 3, 5, 7, 9, 11, 13, 15, 17]
    target = 11
    print(f"Array: {test_array}")
    print(f"Target: {target}")
    result = binary_search_recursive(test_array, target)
    print(f"Result: {result}")
    
    # Test with duplicates
    print("\n=== Binary Search with Duplicates ===")
    test_array = [1, 2, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7]
    target = 2
    print(f"Array: {test_array}")
    print(f"Target: {target}")
    
    first = binary_search_leftmost(test_array, target)
    last = binary_search_rightmost(test_array, target)
    first_last = binary_search_range(test_array, target)
    
    print(f"First occurrence: {first}")
    print(f"Last occurrence: {last}")
    print(f"Range: {first_last}")
    
    # Test insertion point
    print("\n=== Binary Search Insertion Point ===")
    test_array = [1, 3, 5, 7, 9]
    targets = [0, 2, 4, 6, 8, 10]
    print(f"Array: {test_array}")
    
    for target in targets:
        insertion_point = binary_search_insertion_point(test_array, target)
        print(f"Insert {target} at index {insertion_point}")
    
    # Test 2D matrix search
    print("\n=== 2D Matrix Binary Search ===")
    matrix = [
        [1,  4,  7,  11],
        [2,  5,  8,  12],
        [3,  6,  9,  16],
        [10, 13, 14, 17]
    ]
    target = 5
    print("Matrix:")
    for row in matrix:
        print(f"  {row}")
    print(f"Target: {target}")
    result = binary_search_2d_matrix(matrix, target)
    if result != (-1, -1):
        print(f"Found at position {result}")
    else:
        print("Not found")
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [2, 5, 8, 12, 16, 23, 38, 56, 67, 78]
    target = 23
    binary_search_verbose(sample_array, target)