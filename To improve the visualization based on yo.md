To improve the visualization based on your instructions and the screenshot:

### 1. Show Elements in Left and Right Subarrays
- **Current:** The table displays left and right subarrays as index ranges (e.g., `[0, 1]`, `[3, 3]`).
- **Update:** Instead, display the actual elements in those subarrays. For example, if the left subarray is `[0, 1]` and the array is `[10, 20, 27, ...]`, show `[10, 20]`.

**Example (Table Update):**
| Call | Subarray      | Pivot Value | Pivot Index | Left Subarray    | Right Subarray    | Array after partition            |
|------|--------------|-------------|-------------|------------------|-------------------|----------------------------------|
| 1    | [0,9]        | 27          | 2           | [10, 20]         | [68, 50, 48, ...] | [10, 20, 27, 68, 50, ...]        |
| 2    | [0,1]        | 10          | none        | none             | [20]              | ...                              |

### 2. Tree Visualization for Call Relationships
- **Current:** The calls are shown as disconnected blocks.
- **Update:** Above the table, show the recursive calls as a tree. Each node should show the subarray elements for that call, and lines should connect parent calls to their left/right subarray calls—representing the recursion visually.

**Example (Tree Visualization):**

```
[50,90,70,60,20,40,45,80,10,27]
                |
             pivot=27
       /                     \
 [20,10]                   [60,90,40,45,80,50,70]
   |                              |
 pivot=10                      pivot=70
  /    \                      /          \
[]   [20]           [60,40,45,50]     [90,80]
                           |              |
                        pivot=50       pivot=80
                         /    \          /   \
                     [40,45] [60]    [80]   [90]
                      |
                    pivot=45
```
- Each node in the tree shows the actual array elements for the subarray of that call.
- Lines visually connect parent calls to their left and right recursive calls.

---

**Summary of Requested Changes:**
- In the table, replace subarray index ranges with actual array elements for left/right subarrays.
- Above the table, add a tree visualization. Each node shows the subarray elements, and lines connect recursive calls to represent the call hierarchy.

Would you like example code for generating such a visualization, or mockups for the UI update?