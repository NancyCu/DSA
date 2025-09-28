"""
Breadth-First Search (BFS) Algorithm Implementation

Breadth-First Search is a graph traversal algorithm that explores vertices level by level,
visiting all vertices at distance k before visiting any vertices at distance k+1.
It uses a queue (FIFO) data structure to keep track of vertices to visit.

Key characteristics:
- Explores breadth-first (level by level)
- Uses a queue (FIFO) data structure
- Guarantees shortest path in unweighted graphs
- Explores all vertices at current level before moving to next level

Time Complexity: O(V + E) where V = vertices, E = edges
Space Complexity: O(V) for visited array and queue

Applications:
- Finding shortest path in unweighted graphs
- Finding all vertices within k distance from source
- Level-order traversal of trees
- Finding connected components
- Web crawling
- Social networking features (friends of friends)
"""

from collections import deque

def bfs(graph, start):
    """
    Performs BFS traversal starting from a given vertex.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        
    Returns:
        list: List of vertices in BFS order
        
    Examples:
        >>> graph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': ['F'], 'F': []}
        >>> bfs(graph, 'A')
        ['A', 'B', 'C', 'D', 'E', 'F']
    """
    if start not in graph:
        return []
    
    visited = set()
    queue = deque([start])
    result = []
    
    # Mark starting vertex as visited
    visited.add(start)
    
    while queue:
        # Remove vertex from front of queue
        vertex = queue.popleft()
        result.append(vertex)
        
        # Visit all unvisited neighbors
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result


def bfs_verbose(graph, start):
    """
    BFS with detailed step-by-step output for educational purposes.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        
    Returns:
        list: List of vertices in BFS order
    """
    print(f"Starting BFS from vertex: {start}")
    print(f"Graph: {graph}")
    print("-" * 60)
    
    if start not in graph:
        print(f"Starting vertex {start} not found in graph!")
        return []
    
    visited = set()
    queue = deque([start])
    result = []
    step = 1
    
    # Mark starting vertex as visited
    visited.add(start)
    print(f"Step 0: Initialize")
    print(f"  Starting vertex: {start}")
    print(f"  Initial queue: {list(queue)}")
    print(f"  Visited: {visited}")
    
    while queue:
        print(f"\nStep {step}:")
        print(f"  Queue: {list(queue)}")
        print(f"  Visited: {visited}")
        
        # Remove vertex from front of queue
        vertex = queue.popleft()
        result.append(vertex)
        
        print(f"  Dequeued vertex: {vertex}")
        print(f"  Current BFS order: {result}")
        
        # Get neighbors
        neighbors = graph.get(vertex, [])
        print(f"  Neighbors of {vertex}: {neighbors}")
        
        # Add unvisited neighbors to queue
        new_neighbors = []
        for neighbor in neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                new_neighbors.append(neighbor)
        
        if new_neighbors:
            print(f"  Added to queue: {new_neighbors}")
        else:
            print(f"  No new neighbors to add")
        
        print(f"  Updated queue: {list(queue)}")
        step += 1
    
    print(f"\nFinal BFS order: {result}")
    return result


def bfs_shortest_path(graph, start, end):
    """
    Find the shortest path between start and end vertices using BFS.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        end: Target vertex
        
    Returns:
        list: Shortest path from start to end, or None if no path exists
    """
    if start == end:
        return [start]
    
    visited = set()
    queue = deque([(start, [start])])  # Store (vertex, path_to_vertex)
    visited.add(start)
    
    while queue:
        vertex, path = queue.popleft()
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                new_path = path + [neighbor]
                
                if neighbor == end:
                    return new_path
                
                visited.add(neighbor)
                queue.append((neighbor, new_path))
    
    return None  # No path found


def bfs_shortest_distance(graph, start, end):
    """
    Find the shortest distance between start and end vertices using BFS.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        end: Target vertex
        
    Returns:
        int: Shortest distance from start to end, or -1 if no path exists
    """
    if start == end:
        return 0
    
    visited = set()
    queue = deque([(start, 0)])  # Store (vertex, distance)
    visited.add(start)
    
    while queue:
        vertex, distance = queue.popleft()
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                if neighbor == end:
                    return distance + 1
                
                visited.add(neighbor)
                queue.append((neighbor, distance + 1))
    
    return -1  # No path found


def bfs_level_order(graph, start):
    """
    Perform level-order traversal, grouping vertices by their level/distance from start.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        
    Returns:
        list: List of levels, where each level contains vertices at that distance from start
    """
    if start not in graph:
        return []
    
    visited = set()
    queue = deque([(start, 0)])  # Store (vertex, level)
    visited.add(start)
    levels = []
    current_level = 0
    current_level_vertices = []
    
    while queue:
        vertex, level = queue.popleft()
        
        # If we've moved to a new level, save the previous level
        if level > current_level:
            levels.append(current_level_vertices)
            current_level_vertices = []
            current_level = level
        
        current_level_vertices.append(vertex)
        
        # Add unvisited neighbors
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, level + 1))
    
    # Don't forget the last level
    if current_level_vertices:
        levels.append(current_level_vertices)
    
    return levels


def bfs_vertices_at_distance(graph, start, distance):
    """
    Find all vertices at exactly the given distance from start vertex.
    
    Args:
        graph (dict): Graph represented as adjacency list
        start: Starting vertex
        distance (int): Target distance
        
    Returns:
        list: List of vertices at the specified distance from start
    """
    if distance == 0:
        return [start] if start in graph else []
    
    visited = set()
    queue = deque([(start, 0)])
    visited.add(start)
    vertices_at_distance = []
    
    while queue:
        vertex, current_distance = queue.popleft()
        
        if current_distance == distance:
            vertices_at_distance.append(vertex)
            continue
        
        if current_distance < distance:
            for neighbor in graph.get(vertex, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, current_distance + 1))
    
    return vertices_at_distance


def bfs_connected_components(graph):
    """
    Find all connected components in an undirected graph using BFS.
    
    Args:
        graph (dict): Undirected graph as adjacency list
        
    Returns:
        list: List of connected components, each component is a list of vertices
    """
    visited = set()
    components = []
    
    for vertex in graph:
        if vertex not in visited:
            # Start BFS for this component
            component = []
            queue = deque([vertex])
            visited.add(vertex)
            
            while queue:
                current = queue.popleft()
                component.append(current)
                
                for neighbor in graph.get(current, []):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            
            components.append(component)
    
    return components


def bfs_bipartite_check(graph):
    """
    Check if a graph is bipartite using BFS coloring.
    
    Args:
        graph (dict): Graph as adjacency list
        
    Returns:
        tuple: (is_bipartite, coloring) where coloring is a dict mapping vertex to color
    """
    color = {}
    
    # Check each connected component
    for start in graph:
        if start not in color:
            # Start BFS coloring
            queue = deque([start])
            color[start] = 0  # Color with 0
            
            while queue:
                vertex = queue.popleft()
                
                for neighbor in graph.get(vertex, []):
                    if neighbor not in color:
                        # Color with opposite color
                        color[neighbor] = 1 - color[vertex]
                        queue.append(neighbor)
                    elif color[neighbor] == color[vertex]:
                        # Same color as adjacent vertex - not bipartite
                        return False, color
    
    return True, color


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
    
    print("=== BFS Test Cases ===\n")
    print("Graph 1 (Connected):")
    for vertex, neighbors in graph1.items():
        print(f"  {vertex}: {neighbors}")
    
    print(f"\nBFS from A: {bfs(graph1, 'A')}")
    
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
    
    print(f"BFS from A: {bfs(graph2, 'A')}")
    
    # Test shortest path
    print(f"\n=== Shortest Path ===")
    path = bfs_shortest_path(graph1, 'A', 'F')
    print(f"Shortest path from A to F: {path}")
    
    distance = bfs_shortest_distance(graph1, 'A', 'F')
    print(f"Shortest distance from A to F: {distance}")
    
    # Test level-order traversal
    print(f"\n=== Level-Order Traversal ===")
    levels = bfs_level_order(graph1, 'A')
    print(f"Vertices by level from A:")
    for i, level in enumerate(levels):
        print(f"  Level {i}: {level}")
    
    # Test vertices at specific distance
    print(f"\n=== Vertices at Distance ===")
    for dist in range(4):
        vertices = bfs_vertices_at_distance(graph1, 'A', dist)
        print(f"Vertices at distance {dist} from A: {vertices}")
    
    # Test connected components
    print(f"\n=== Connected Components ===")
    components1 = bfs_connected_components(graph1)
    print(f"Components in Graph 1: {components1}")
    
    components2 = bfs_connected_components(graph2)
    print(f"Components in Graph 2: {components2}")
    
    # Test bipartite check
    print(f"\n=== Bipartite Check ===")
    
    # Bipartite graph
    bipartite_graph = {
        'A': ['C', 'D'],
        'B': ['C', 'D'],
        'C': ['A', 'B'],
        'D': ['A', 'B']
    }
    
    is_bipartite, coloring = bfs_bipartite_check(bipartite_graph)
    print(f"Bipartite graph: {bipartite_graph}")
    print(f"Is bipartite: {is_bipartite}")
    if is_bipartite:
        print(f"Coloring: {coloring}")
    
    # Non-bipartite graph (triangle)
    triangle = {
        'A': ['B', 'C'],
        'B': ['A', 'C'],
        'C': ['A', 'B']
    }
    
    is_bipartite2, coloring2 = bfs_bipartite_check(triangle)
    print(f"\nTriangle graph: {triangle}")
    print(f"Is bipartite: {is_bipartite2}")
    
    # Verbose example for educational purposes
    print(f"\n=== Verbose Example ===")
    simple_graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B'],
        'F': ['C']
    }
    bfs_verbose(simple_graph, 'A')