"""
Count Sort (Counting Sort) Algorithm Implementation

Counting Sort is a non-comparative sorting algorithm that sorts elements by counting
the number of occurrences of each unique element in the array. It then uses arithmetic
to calculate the position of each object in the output sequence.

Key characteristics:
- Non-comparative sorting algorithm
- Stable sorting algorithm
- Efficient when the range of potential items (k) is not significantly greater than n
- Works well for integers and objects that can be used as array indices

Time Complexity:
- Best Case: O(n + k) where k is the range of input
- Average Case: O(n + k)
- Worst Case: O(n + k)

Space Complexity: O(k) for the counting array, plus O(n) for output array = O(n + k)

Stability: Stable - maintains relative order of equal elements
"""

def count_sort(arr):
    """
    Sorts an array of non-negative integers using counting sort.
    
    Args:
        arr (list): List of non-negative integers to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> count_sort([4, 2, 2, 8, 3, 3, 1])
        [1, 2, 2, 3, 3, 4, 8]
        
        >>> count_sort([1, 4, 1, 2, 7, 5, 2])
        [1, 1, 2, 2, 4, 5, 7]
        
        >>> count_sort([1])
        [1]
        
        >>> count_sort([])
        []
    """
    # Handle edge cases
    if len(arr) <= 1:
        return arr.copy()
    
    # Check for non-negative integers
    if any(x < 0 for x in arr):
        raise ValueError("Count sort only works with non-negative integers")
    
    # Find the maximum element to determine the range
    max_val = max(arr)
    min_val = min(arr)
    range_val = max_val - min_val + 1
    
    # Create counting array and output array
    count = [0] * range_val
    output = [0] * len(arr)
    
    # Count occurrences of each element
    for num in arr:
        count[num - min_val] += 1
    
    # Modify count array to store actual positions
    for i in range(1, range_val):
        count[i] += count[i - 1]
    
    # Build output array by placing elements in their correct positions
    # Process from right to left to maintain stability
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i] - min_val] - 1] = arr[i]
        count[arr[i] - min_val] -= 1
    
    return output


def count_sort_simple(arr):
    """
    Simple version of counting sort that directly places elements.
    This version is easier to understand but less efficient and not stable.
    
    Args:
        arr (list): List of non-negative integers to be sorted
        
    Returns:
        list: Sorted list
    """
    if len(arr) <= 1:
        return arr.copy()
    
    if any(x < 0 for x in arr):
        raise ValueError("Count sort only works with non-negative integers")
    
    # Find range
    max_val = max(arr)
    min_val = min(arr)
    range_val = max_val - min_val + 1
    
    # Count occurrences
    count = [0] * range_val
    for num in arr:
        count[num - min_val] += 1
    
    # Reconstruct sorted array
    result = []
    for i, freq in enumerate(count):
        result.extend([i + min_val] * freq)
    
    return result


def count_sort_verbose(arr):
    """
    Counting sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of non-negative integers to be sorted
        
    Returns:
        list: Sorted list
    """
    print(f"Starting Count Sort with array: {arr}")
    print("-" * 50)
    
    if len(arr) <= 1:
        print("Array has 0 or 1 element, already sorted!")
        return arr.copy()
    
    if any(x < 0 for x in arr):
        print("Error: Count sort only works with non-negative integers")
        return arr.copy()
    
    # Step 1: Find range
    max_val = max(arr)
    min_val = min(arr)
    range_val = max_val - min_val + 1
    
    print(f"Step 1: Determine range")
    print(f"  Minimum value: {min_val}")
    print(f"  Maximum value: {max_val}")
    print(f"  Range: {range_val} (need array of size {range_val})")
    
    # Step 2: Count occurrences
    count = [0] * range_val
    
    print(f"\nStep 2: Count occurrences of each element")
    print(f"  Initial count array: {count}")
    
    for num in arr:
        count[num - min_val] += 1
        print(f"  Counting {num} at index {num - min_val}: {count}")
    
    print(f"  Final count array: {count}")
    
    # Step 3: Calculate cumulative counts (for stable sorting)
    print(f"\nStep 3: Calculate cumulative counts")
    print(f"  Count array before: {count}")
    
    for i in range(1, range_val):
        count[i] += count[i - 1]
    
    print(f"  Cumulative counts:  {count}")
    print(f"  (Each value represents the position where elements <= that value should end)")
    
    # Step 4: Build output array
    output = [0] * len(arr)
    
    print(f"\nStep 4: Place elements in correct positions (processing right to left for stability)")
    print(f"  Initial output array: {output}")
    
    for i in range(len(arr) - 1, -1, -1):
        element = arr[i]
        position = count[element - min_val] - 1
        output[position] = element
        count[element - min_val] -= 1
        
        print(f"  Processing arr[{i}] = {element}:")
        print(f"    Position for {element}: {position}")
        print(f"    Output array: {output}")
        print(f"    Updated counts: {count}")
    
    print(f"\nFinal sorted array: {output}")
    return output


def count_sort_with_objects(objects, key_func):
    """
    Counting sort for objects using a key function.
    
    Args:
        objects (list): List of objects to be sorted
        key_func (function): Function that extracts the sorting key from each object
        
    Returns:
        list: Sorted list of objects
    """
    if len(objects) <= 1:
        return objects.copy()
    
    # Extract keys and find range
    keys = [key_func(obj) for obj in objects]
    
    if any(k < 0 for k in keys):
        raise ValueError("Count sort only works with non-negative integer keys")
    
    max_key = max(keys)
    min_key = min(keys)
    range_val = max_key - min_key + 1
    
    # Count occurrences
    count = [0] * range_val
    for key in keys:
        count[key - min_key] += 1
    
    # Calculate cumulative counts
    for i in range(1, range_val):
        count[i] += count[i - 1]
    
    # Build output array
    output = [None] * len(objects)
    for i in range(len(objects) - 1, -1, -1):
        key = key_func(objects[i])
        output[count[key - min_key] - 1] = objects[i]
        count[key - min_key] -= 1
    
    return output


# Example usage and test cases
if __name__ == "__main__":
    # Test cases
    test_arrays = [
        [4, 2, 2, 8, 3, 3, 1],
        [1, 4, 1, 2, 7, 5, 2],
        [5, 2, 8, 1, 9],
        [1, 2, 3, 4, 5],  # Already sorted
        [5, 4, 3, 2, 1],  # Reverse sorted
        [1],              # Single element
        [],               # Empty array
        [3, 3, 3, 3],     # All same elements
        [0, 1, 0, 1, 0],  # Binary array
    ]
    
    print("=== Count Sort Test Cases ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        try:
            result = count_sort(test_arr)
            print(f"Sorted:   {result}")
        except ValueError as e:
            print(f"Error:    {e}")
        print()
    
    # Test simple version
    print("=== Count Sort Simple Version Test ===")
    test_array = [4, 2, 2, 8, 3, 3, 1]
    print(f"Original: {test_array}")
    result = count_sort_simple(test_array)
    print(f"Sorted:   {result}")
    
    # Test with objects
    print("\n=== Count Sort with Objects ===")
    
    class Student:
        def __init__(self, name, age):
            self.name = name
            self.age = age
        
        def __str__(self):
            return f"{self.name}({self.age})"
        
        def __repr__(self):
            return str(self)
    
    students = [
        Student("Alice", 23),
        Student("Bob", 19),
        Student("Charlie", 21),
        Student("Diana", 19),
        Student("Eve", 25)
    ]
    
    print(f"Original students: {students}")
    sorted_students = count_sort_with_objects(students, lambda s: s.age)
    print(f"Sorted by age:     {sorted_students}")
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [4, 2, 2, 8, 3, 3, 1]
    count_sort_verbose(sample_array)