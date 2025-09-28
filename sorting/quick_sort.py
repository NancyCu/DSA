"""
Quick Sort Algorithm Implementation

Quick Sort is a highly efficient divide-and-conquer sorting algorithm developed by Tony Hoare in 1959.
It works by selecting a 'pivot' element from the array and partitioning the other elements into two
sub-arrays according to whether they are less than or greater than the pivot.

Key characteristics:
- Divide and conquer approach
- In-place sorting (with recursive stack space)
- Not stable (may change relative order of equal elements)
- Average case is very efficient, but worst case is O(n²)

Time Complexity:
- Best Case: O(n log n) - when pivot divides array into equal halves
- Average Case: O(n log n)
- Worst Case: O(n²) - when pivot is always the smallest or largest element

Space Complexity: O(log n) - due to recursive call stack (O(n) in worst case)

Stability: Not stable - may change relative order of equal elements
"""

def quick_sort(arr):
    """
    Sorts an array using the quick sort algorithm.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> quick_sort([64, 34, 25, 12, 22, 11, 90])
        [11, 12, 22, 25, 34, 64, 90]
        
        >>> quick_sort([5, 2, 8, 1, 9])
        [1, 2, 5, 8, 9]
        
        >>> quick_sort([1])
        [1]
        
        >>> quick_sort([])
        []
    """
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    
    def quick_sort_helper(arr, low, high):
        """
        Recursive helper function for quick sort.
        
        Args:
            arr (list): Array to be sorted
            low (int): Starting index of the subarray
            high (int): Ending index of the subarray
        """
        if low < high:
            # Partition the array and get the pivot index
            pivot_index = partition(arr, low, high)
            
            # Recursively sort elements before and after partition
            quick_sort_helper(arr, low, pivot_index - 1)
            quick_sort_helper(arr, pivot_index + 1, high)
    
    def partition(arr, low, high):
        """
        Partition function using Lomuto partition scheme.
        Takes the last element as pivot, places it at its correct position
        in sorted array, and places all smaller elements to left of pivot
        and all greater elements to right of pivot.
        
        Args:
            arr (list): Array to be partitioned
            low (int): Starting index
            high (int): Ending index
            
        Returns:
            int: Index of the pivot after partitioning
        """
        # Choose the rightmost element as pivot
        pivot = arr[high]
        
        # Index of smaller element (indicates right position of pivot found so far)
        i = low - 1
        
        for j in range(low, high):
            # If current element is smaller than or equal to pivot
            if arr[j] <= pivot:
                i += 1  # Increment index of smaller element
                arr[i], arr[j] = arr[j], arr[i]  # Swap elements
        
        # Place pivot in its correct position
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    # Handle edge cases
    if len(arr_copy) <= 1:
        return arr_copy
    
    # Start the recursive sorting
    quick_sort_helper(arr_copy, 0, len(arr_copy) - 1)
    return arr_copy


def quick_sort_hoare(arr):
    """
    Quick sort using Hoare partition scheme (alternative implementation).
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list
    """
    arr_copy = arr.copy()
    
    def quick_sort_helper(arr, low, high):
        if low < high:
            pivot_index = hoare_partition(arr, low, high)
            quick_sort_helper(arr, low, pivot_index)
            quick_sort_helper(arr, pivot_index + 1, high)
    
    def hoare_partition(arr, low, high):
        """
        Hoare partition scheme - more efficient than Lomuto.
        Uses two pointers moving towards each other.
        """
        pivot = arr[low]  # Choose first element as pivot
        i = low - 1
        j = high + 1
        
        while True:
            # Move left pointer to find element >= pivot
            i += 1
            while arr[i] < pivot:
                i += 1
            
            # Move right pointer to find element <= pivot
            j -= 1
            while arr[j] > pivot:
                j -= 1
            
            # If pointers crossed, partitioning is done
            if i >= j:
                return j
            
            # Swap elements at i and j
            arr[i], arr[j] = arr[j], arr[i]
    
    if len(arr_copy) <= 1:
        return arr_copy
    
    quick_sort_helper(arr_copy, 0, len(arr_copy) - 1)
    return arr_copy


def quick_sort_verbose(arr, depth=0, low=None, high=None):
    """
    Quick sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of comparable elements to be sorted
        depth (int): Current recursion depth (for formatting)
        low (int): Low boundary (for recursive calls)
        high (int): High boundary (for recursive calls)
        
    Returns:
        list: Sorted list
    """
    if depth == 0:
        print(f"Starting Quick Sort with array: {arr}")
        print("-" * 60)
        arr = arr.copy()
        low, high = 0, len(arr) - 1
    
    indent = "  " * depth
    
    if low >= high:
        if low == high:
            print(f"{indent}Base case: single element [{arr[low]}]")
        return arr
    
    print(f"{indent}Sorting subarray[{low}:{high+1}] = {arr[low:high+1]}")
    
    # Partition and show the process
    pivot_index = partition_verbose(arr, low, high, depth)
    
    print(f"{indent}After partitioning: {arr[low:high+1]}")
    print(f"{indent}Pivot {arr[pivot_index]} is now at correct position {pivot_index}")
    
    # Recursively sort left partition
    if pivot_index > low:
        print(f"{indent}Sorting left partition: {arr[low:pivot_index]}")
        quick_sort_verbose(arr, depth + 1, low, pivot_index - 1)
    
    # Recursively sort right partition  
    if pivot_index < high:
        print(f"{indent}Sorting right partition: {arr[pivot_index+1:high+1]}")
        quick_sort_verbose(arr, depth + 1, pivot_index + 1, high)
    
    if depth == 0:
        print(f"\nFinal sorted array: {arr}")
    
    return arr


def partition_verbose(arr, low, high, depth):
    """Partition function with verbose output"""
    indent = "  " * depth
    pivot = arr[high]
    print(f"{indent}  Pivot chosen: {pivot} (last element)")
    
    i = low - 1
    print(f"{indent}  Initial i = {i}")
    
    for j in range(low, high):
        print(f"{indent}  Comparing arr[{j}] = {arr[j]} with pivot {pivot}")
        if arr[j] <= pivot:
            i += 1
            if i != j:
                print(f"{indent}    {arr[j]} <= {pivot}, swapping arr[{i}] and arr[{j}]")
                arr[i], arr[j] = arr[j], arr[i]
                print(f"{indent}    Array now: {arr[low:high+1]}")
            else:
                print(f"{indent}    {arr[j]} <= {pivot}, no swap needed")
        else:
            print(f"{indent}    {arr[j]} > {pivot}, no action")
    
    # Place pivot in correct position
    print(f"{indent}  Placing pivot {pivot} at position {i+1}")
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    
    return i + 1


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
    
    print("=== Quick Sort Test Cases (Lomuto) ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        result = quick_sort(test_arr)
        print(f"Sorted:   {result}")
        print()
    
    # Test Hoare partition variant
    print("=== Quick Sort Test Cases (Hoare) ===\n")
    test_array = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {test_array}")
    result = quick_sort_hoare(test_array)
    print(f"Sorted:   {result}")
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [64, 34, 25, 12, 22, 11]
    quick_sort_verbose(sample_array)