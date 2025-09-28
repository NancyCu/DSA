"""
Merge Sort Algorithm Implementation

Merge Sort is a divide-and-conquer algorithm that was invented by John von Neumann in 1945.
It divides the input array into two halves, recursively sorts both halves, and then merges
the two sorted halves to produce the final sorted array.

Key characteristics:
- Divide and conquer approach
- Stable sorting algorithm
- Not in-place (requires additional space)
- Consistent performance regardless of input data

Time Complexity:
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n log n)

Space Complexity: O(n) - requires additional space for temporary arrays

Stability: Stable - maintains relative order of equal elements
"""

def merge_sort(arr):
    """
    Sorts an array using the merge sort algorithm.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> merge_sort([64, 34, 25, 12, 22, 11, 90])
        [11, 12, 22, 25, 34, 64, 90]
        
        >>> merge_sort([5, 2, 8, 1, 9])
        [1, 2, 5, 8, 9]
        
        >>> merge_sort([1])
        [1]
        
        >>> merge_sort([])
        []
    """
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    
    def merge_sort_helper(arr, left, right):
        """
        Recursive helper function for merge sort.
        
        Args:
            arr (list): Array to be sorted
            left (int): Starting index of the subarray
            right (int): Ending index of the subarray
        """
        if left < right:
            # Find the middle point to divide the array into two halves
            mid = (left + right) // 2
            
            # Recursively sort both halves
            merge_sort_helper(arr, left, mid)
            merge_sort_helper(arr, mid + 1, right)
            
            # Merge the sorted halves
            merge(arr, left, mid, right)
    
    def merge(arr, left, mid, right):
        """
        Merge two sorted subarrays arr[left..mid] and arr[mid+1..right].
        
        Args:
            arr (list): Array containing both subarrays
            left (int): Starting index of first subarray
            mid (int): Ending index of first subarray
            right (int): Ending index of second subarray
        """
        # Create temporary arrays for the two subarrays
        left_arr = arr[left:mid + 1]
        right_arr = arr[mid + 1:right + 1]
        
        # Initial indices for left_arr, right_arr, and merged array
        i = j = 0
        k = left
        
        # Merge the two arrays back into arr[left..right]
        while i < len(left_arr) and j < len(right_arr):
            if left_arr[i] <= right_arr[j]:
                arr[k] = left_arr[i]
                i += 1
            else:
                arr[k] = right_arr[j]
                j += 1
            k += 1
        
        # Copy remaining elements of left_arr, if any
        while i < len(left_arr):
            arr[k] = left_arr[i]
            i += 1
            k += 1
        
        # Copy remaining elements of right_arr, if any
        while j < len(right_arr):
            arr[k] = right_arr[j]
            j += 1
            k += 1
    
    # Handle edge cases
    if len(arr_copy) <= 1:
        return arr_copy
    
    # Start the recursive sorting
    merge_sort_helper(arr_copy, 0, len(arr_copy) - 1)
    return arr_copy


def merge_sort_verbose(arr, depth=0, left=None, right=None):
    """
    Merge sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of comparable elements to be sorted
        depth (int): Current recursion depth (for formatting)
        left (int): Left boundary (for recursive calls)
        right (int): Right boundary (for recursive calls)
        
    Returns:
        list: Sorted list
    """
    if depth == 0:
        print(f"Starting Merge Sort with array: {arr}")
        print("-" * 60)
        arr = arr.copy()
        left, right = 0, len(arr) - 1
    
    indent = "  " * depth
    
    if left >= right:
        if left == right:
            print(f"{indent}Base case: single element [{arr[left]}]")
        return arr
    
    print(f"{indent}Dividing array[{left}:{right+1}] = {arr[left:right+1]}")
    
    # Find middle point
    mid = (left + right) // 2
    print(f"{indent}Mid point: {mid}")
    
    # Recursively sort left half
    print(f"{indent}Sorting left half: {arr[left:mid+1]}")
    merge_sort_verbose(arr, depth + 1, left, mid)
    
    # Recursively sort right half
    print(f"{indent}Sorting right half: {arr[mid+1:right+1]}")
    merge_sort_verbose(arr, depth + 1, mid + 1, right)
    
    # Merge the two halves
    print(f"{indent}Merging {arr[left:mid+1]} and {arr[mid+1:right+1]}")
    
    # Store original values for display
    left_part = arr[left:mid+1].copy()
    right_part = arr[mid+1:right+1].copy()
    
    # Perform merge
    left_arr = arr[left:mid + 1]
    right_arr = arr[mid + 1:right + 1]
    
    i = j = 0
    k = left
    
    while i < len(left_arr) and j < len(right_arr):
        if left_arr[i] <= right_arr[j]:
            arr[k] = left_arr[i]
            i += 1
        else:
            arr[k] = right_arr[j]
            j += 1
        k += 1
    
    while i < len(left_arr):
        arr[k] = left_arr[i]
        i += 1
        k += 1
    
    while j < len(right_arr):
        arr[k] = right_arr[j]
        j += 1
        k += 1
    
    print(f"{indent}Merged result: {arr[left:right+1]}")
    
    if depth == 0:
        print(f"\nFinal sorted array: {arr}")
    
    return arr


# Example usage and test cases
if __name__ == "__main__":
    # Test cases
    test_arrays = [
        [64, 34, 25, 12, 22, 11, 90],
        [5, 2, 8, 1, 9],
        [1, 2, 3, 4, 5],  # Already sorted
        [5, 4, 3, 2, 1],  # Reverse sorted
        [1],              # Single element
        [],               # Empty array
        [3, 3, 3, 3],     # All same elements
    ]
    
    print("=== Merge Sort Test Cases ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        result = merge_sort(test_arr)
        print(f"Sorted:   {result}")
        print()
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [64, 34, 25, 12, 22, 11]
    merge_sort_verbose(sample_array)