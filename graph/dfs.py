"""
Depth-First Search (DFS) Algorithm Implementation

Depth-First Search is a graph traversal algorithm that explores as far as possible
along each branch before backtracking. It can be implemented using recursion or
an explicit stack data structure.

Key characteristics:
- Explores depth-first before exploring siblings
- Uses a stack (LIFO) data structure (explicitly or via recursion)
- Can be used for various graph problems (connectivity, cycles, topological sorting)
- Works on both directed and undirected graphs

Time Complexity: O(V + E) where V = vertices, E = edges
Space Complexity: O(V) for visited array and recursion stack/explicit stack

Applications:
- Finding connected components
- Detecting cycles in graphs
- Topological sorting
- Finding strongly connected components
- Solving puzzles (mazes, sudoku)
"""

def dfs_recursive(graph, start, visited=None):
    """
    Performs DFS traversal using recursion.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        visited (set): Set of visited vertices (used in recursion)
        
    Returns:
        list: List of vertices in DFS order
        
    Examples:
        >>> graph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': []}
        >>> dfs_recursive(graph, 'A')
        ['A', 'B', 'D', 'E', 'F', 'C']
    """
    if visited is None:
        visited = set()
    
    # List to store the traversal order
    result = []
    
    def dfs_helper(vertex):
        # Mark current vertex as visited
        visited.add(vertex)
        result.append(vertex)
        
        # Visit all unvisited neighbors
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                dfs_helper(neighbor)
    
    dfs_helper(start)
    return result


def dfs_iterative(graph, start):
    """
    Performs DFS traversal using an explicit stack.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        
    Returns:
        list: List of vertices in DFS order
    """
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        # Pop vertex from stack
        vertex = stack.pop()
        
        if vertex not in visited:
            # Mark as visited and add to result
            visited.add(vertex)
            result.append(vertex)
            
            # Add all unvisited neighbors to stack
            # Note: Add in reverse order to maintain left-to-right traversal
            for neighbor in reversed(graph.get(vertex, [])):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result


def dfs_verbose(graph, start, method='recursive'):
    """
    DFS with detailed step-by-step output for educational purposes.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        method (str): 'recursive' or 'iterative'
        
    Returns:
        list: List of vertices in DFS order
    """
    print(f"Starting DFS ({method}) from vertex: {start}")
    print(f"Graph: {graph}")
    print("-" * 60)
    
    if method == 'recursive':
        return dfs_verbose_recursive(graph, start)
    else:
        return dfs_verbose_iterative(graph, start)


def dfs_verbose_recursive(graph, start, visited=None, depth=0):
    """DFS recursive implementation with verbose output"""
    if visited is None:
        visited = set()
    
    result = []
    indent = "  " * depth
    
    def dfs_helper(vertex, current_depth):
        current_indent = "  " * current_depth
        print(f"{current_indent}Visiting vertex: {vertex}")
        
        # Mark as visited
        visited.add(vertex)
        result.append(vertex)
        print(f"{current_indent}Marked {vertex} as visited")
        print(f"{current_indent}Current path: {result}")
        
        # Get neighbors
        neighbors = graph.get(vertex, [])
        print(f"{current_indent}Neighbors of {vertex}: {neighbors}")
        
        # Visit unvisited neighbors
        for neighbor in neighbors:
            if neighbor not in visited:
                print(f"{current_indent}Recursively exploring {neighbor}")
                dfs_helper(neighbor, current_depth + 1)
            else:
                print(f"{current_indent}{neighbor} already visited, skipping")
        
        print(f"{current_indent}Finished exploring {vertex}")
    
    dfs_helper(start, 0)
    print(f"\nFinal DFS order: {result}")
    return result


def dfs_verbose_iterative(graph, start):
    """DFS iterative implementation with verbose output"""
    visited = set()
    stack = [start]
    result = []
    step = 1
    
    print(f"Initial stack: {stack}")
    
    while stack:
        print(f"\nStep {step}:")
        print(f"  Stack: {stack}")
        print(f"  Visited: {visited}")
        
        # Pop from stack
        vertex = stack.pop()
        print(f"  Popped vertex: {vertex}")
        
        if vertex not in visited:
            # Visit vertex
            visited.add(vertex)
            result.append(vertex)
            print(f"  Visiting {vertex} (not visited before)")
            print(f"  Current path: {result}")
            
            # Add neighbors to stack
            neighbors = graph.get(vertex, [])
            print(f"  Neighbors of {vertex}: {neighbors}")
            
            unvisited_neighbors = [n for n in reversed(neighbors) if n not in visited]
            stack.extend(unvisited_neighbors)
            
            if unvisited_neighbors:
                print(f"  Added to stack: {unvisited_neighbors}")
            else:
                print(f"  No new neighbors to add")
        else:
            print(f"  {vertex} already visited, skipping")
        
        print(f"  Updated stack: {stack}")
        step += 1
    
    print(f"\nFinal DFS order: {result}")
    return result


def dfs_find_path(graph, start, end, path=None):
    """
    Find a path between start and end vertices using DFS.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        end: Target vertex
        path (list): Current path (used in recursion)
        
    Returns:
        list: Path from start to end, or None if no path exists
    """
    if path is None:
        path = []
    
    path = path + [start]
    
    if start == end:
        return path
    
    for neighbor in graph.get(start, []):
        if neighbor not in path:  # Avoid cycles
            new_path = dfs_find_path(graph, neighbor, end, path)
            if new_path:
                return new_path
    
    return None


def dfs_find_all_paths(graph, start, end, path=None, all_paths=None):
    """
    Find all paths between start and end vertices using DFS.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        end: Target vertex
        path (list): Current path
        all_paths (list): List to collect all paths
        
    Returns:
        list: List of all paths from start to end
    """
    if path is None:
        path = []
    if all_paths is None:
        all_paths = []
    
    path = path + [start]
    
    if start == end:
        all_paths.append(path)
        return all_paths
    
    for neighbor in graph.get(start, []):
        if neighbor not in path:  # Avoid cycles
            dfs_find_all_paths(graph, neighbor, end, path, all_paths)
    
    return all_paths


def dfs_detect_cycle(graph):
    """
    Detect if there's a cycle in an undirected graph using DFS.
    
    Args:
        graph (dict): Undirected graph as adjacency list
        
    Returns:
        bool: True if cycle exists, False otherwise
    """
    visited = set()
    
    def has_cycle(vertex, parent):
        visited.add(vertex)
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                if has_cycle(neighbor, vertex):
                    return True
            elif neighbor != parent:
                # Found a back edge (cycle)
                return True
        
        return False
    
    # Check each component
    for vertex in graph:
        if vertex not in visited:
            if has_cycle(vertex, None):
                return True
    
    return False


def dfs_connected_components(graph):
    """
    Find all connected components in an undirected graph using DFS.
    
    Args:
        graph (dict): Undirected graph as adjacency list
        
    Returns:
        list: List of connected components, each component is a list of vertices
    """
    visited = set()
    components = []
    
    def dfs_component(vertex, component):
        visited.add(vertex)
        component.append(vertex)
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                dfs_component(neighbor, component)
    
    for vertex in graph:
        if vertex not in visited:
            component = []
            dfs_component(vertex, component)
            components.append(component)
    
    return components


# Example usage and test cases
if __name__ == "__main__":
    # Test graph 1: Simple connected graph
    graph1 = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B', 'F'],
        'F': ['C', 'E']
    }
    
    print("=== DFS Test Cases ===\n")
    print("Graph 1 (Connected):")
    for vertex, neighbors in graph1.items():
        print(f"  {vertex}: {neighbors}")
    
    print(f"\nDFS Recursive from A: {dfs_recursive(graph1, 'A')}")
    print(f"DFS Iterative from A: {dfs_iterative(graph1, 'A')}")
    
    # Test graph 2: Disconnected graph
    graph2 = {
        'A': ['B'],
        'B': ['A'],
        'C': ['D'],
        'D': ['C'],
        'E': []
    }
    
    print(f"\nGraph 2 (Disconnected):")
    for vertex, neighbors in graph2.items():
        print(f"  {vertex}: {neighbors}")
    
    print(f"\nDFS from A: {dfs_recursive(graph2, 'A')}")
    
    # Test pathfinding
    print(f"\n=== Path Finding ===")
    path = dfs_find_path(graph1, 'A', 'F')
    print(f"Path from A to F: {path}")
    
    all_paths = dfs_find_all_paths(graph1, 'A', 'F')
    print(f"All paths from A to F: {all_paths}")
    
    # Test cycle detection
    print(f"\n=== Cycle Detection ===")
    print(f"Graph 1 has cycle: {dfs_detect_cycle(graph1)}")
    
    # Acyclic graph (tree)
    tree = {
        'A': ['B', 'C'],
        'B': ['A', 'D'],
        'C': ['A'],
        'D': ['B']
    }
    print(f"Tree has cycle: {dfs_detect_cycle(tree)}")
    
    # Test connected components
    print(f"\n=== Connected Components ===")
    components1 = dfs_connected_components(graph1)
    print(f"Components in Graph 1: {components1}")
    
    components2 = dfs_connected_components(graph2)
    print(f"Components in Graph 2: {components2}")
    
    # Verbose example for educational purposes
    print(f"\n=== Verbose Example (Recursive) ===")
    simple_graph = {
        'A': ['B', 'C'],
        'B': ['D'],
        'C': ['E'],
        'D': [],
        'E': []
    }
    dfs_verbose(simple_graph, 'A', 'recursive')