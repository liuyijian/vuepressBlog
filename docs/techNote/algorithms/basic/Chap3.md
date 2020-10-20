# Chap 3 贪心

#### 活动安排

设有 $n$ 个活动的集合 $A = \{a_1,a_2, \dots, a_n\}$ ，每个活动 $a_i$ 的起末时间安排是$[start_i,end_i)$  ，对于一个场地一次只能进行一个活动，要求安排尽可能多的活动。

贪心选择：优先安排最先结束的活动

```python
from dataclasses import dataclass
import random

@dataclass
class Activity:
    start:int
    end:int


def schedule(li):
    li = sorted(li, key=lambda x: x.end)
    choose_li = [True] * len(li)
    j = 0
    for i in range(1, len(li)):
        if li[i].start >= li[j].end:
            choose_li[i] = True
            j = i
        else:
            choose_li[i] = False
    print(li)
    print(choose_li)


def schedule_test():
    li = []
    for _ in range(10):
        start = random.randint(1,100)
        end = start + random.randint(1,100)
        li.append(Activity(start,end))
    schedule(li)

schedule_test()
```

#### 单源最短路径

Dijkstra算法是解决单源最短路径问题的一个贪心算法。基本思想是，设置一个顶点集合 $S$ 并不断作贪心选择来扩充这个集合。（https://blog.csdn.net/puiopp63/article/details/96102945）(https://blog.csdn.net/Yuan52007298/article/details/80180839)

* 引进两个集合 $S$ 和 $U$ ，前者记录已求出最短路径的顶点（及对应的最短路径长度），后者记录还未求出最短路径的顶点（以及该顶点到起点s的距离）
* 初始时，$S$ 只包含起点 $s$，$U$ 包含其他顶点

```python
#定义不可达距离
_ = float('inf')
 
#points点个数，edges边个数,graph路径连通图,start起点,end终点
def Dijkstra(points,edges,graph,start,end):
    map = [[ _ for i in range(points + 1)] for j in range(points + 1)]
    pre = [0]*(points+1) #记录前驱
    vis = [0]*(points+1) #记录节点遍历状态
    dis = [_ for i in range(points + 1)] #保存最短距离
    road = [0]*(points+1) #保存最短路径
    roads = []
    map = graph
 
    for i in range(points+1):#初始化起点到其他点的距离
        if i == start :
            dis[i] = 0
        else :
            dis[i] = map[start][i]
        if map[start][i] != _ :
            pre[i] = start
        else :
            pre[i] = -1
    vis[start] = 1
    for i in range(points+1):#每循环一次确定一条最短路
        min = _
        t = 0
        for j in range(points+1):#寻找当前最短路
            if vis[j] == 0 and dis[j] < min :
                t = j
                min = dis[j]
        vis[t] = 1 #找到最短的一条路径 ,标记
        for j in range(points+1):
            if vis[j] == 0 and dis[j] > dis[t]+ map[t][j]:
                dis[j] = dis[t] + map[t][j]
                pre[j] = t
    p = end
    len = 0
    while p >= 1 and len < points:
        road[len] = p
        p = pre[p]
        len += 1
    mark = 0
    len -= 1
    while len >= 0:
        roads.append(road[len])
        len -= 1
    return dis[end],roads
 
#固定map图
def map():
    map = [[_, _, _, _, _, _],
           [_, _, 2, 3, _, 7],
           [_, 2, _, _, 2, _],
           [_, 3, _, _, _, 5],
           [_, _, 2, _, _, 3],
           [_, 7, _, 5, 3, _]
           ]
    s, e = input("输入起点和终点：").split()
    dis,road = Dijkstra(5,7,map,int(s),int(e))
    print("最短距离：",dis)
    print("最短路径：",road)
 
#输入边关系构造map图
def createmap():
    a,b = input("输入节点数和边数：").split()
    n = int(a)
    m = int(b)
    map = [[ _ for i in range(n+1)] for j in range(n+1)]
    for i in range(m+1):
        x,y,z = input("输入两边和长度：").split()
        point = int(x)
        edge = int(y)
        map[point][edge] = float(z)
        map[edge][point] = float(z)
    s,e = input("输入起点和终点：").split()
    start = int(s)
    end = int(e)
    dis,road = Dijkstra(n,m,map,start,end)
    print("最短距离：",dis)
    print("最短路径：",road)
 
if __name__=='__main__':
    map()
```

#### 最小生成树

###### Kruskal

* 按边从小到大遍历，若和已知的边成环则抛弃它，直到找到节点数-1条边
* 时间复杂度 $O(e\log e)$，适合稀疏图

```python
def Kruskal(vertexs, edges):
   '史上最简，没有之一'
    nodes = {}
    for vertex in vertexs:
        nodes[vertex] = set(vertex)
    edges = sorted(edges, key=lambda element: element[2])
    MST = []
    MST_SIZE = len(nodes)-1
    for e in edges:
        node1, node2, _ = e
        if nodes[node1] & nodes[node2]:
            continue
        else:
            MST.append(e)
            tmp = nodes[node1] | nodes[node2]
            for node in tmp:
                nodes[node] |= tmp
            MST_SIZE -= 1
        if MST_SIZE == 0:
            break
    return MST

def Kruskal_test():  
    vertexs = set('ABCDE')
    edges = [("A", "B", 1), ("A", "C", 7),("A", "D", 3), ("B", "C", 6),("B", "E", 2), ("C", "D", 8),("C", "E", 5), ("D", "E", 10)]
    print("The minimum spanning tree by Kruskal is : ", Kruskal(vertexs, edges))
```

###### Prim

* 从单节点构成的连通分支开始，找该分支往外延伸的最小边，加入分支，直到找到节点数-1条边
* 时间复杂度 $O(v^2)$

```python
def Prim(vertexs, edges):
  	'有空再写'
  	pass
def Prim_test():  
    vertexs = set('ABCDE')
    edges = [("A", "B", 1), ("A", "C", 7),("A", "D", 3), ("B", "C", 6),("B", "E", 2), ("C", "D", 8),("C", "E", 5), ("D", "E", 10)]
    print("The minimum spanning tree by Prim is : ", Prim(vertexs, edges))
```

#### 多机调度

有$n$ 个独立的作业 $S = \{s_1, s_2, \dots, s_n\}$ ,由 $m$ 台相同的机器进行加工，作业 $s_i$ 的用时是 $t_i$ , 要求给出一种作业调度方案，使得 $n$ 个作业尽可能短的时间内由 $m$ 台机器加工处理完成。

这是NP完全问题，但采用最长处理时间作业优先的贪心选择策略，会给出较好的近似算法。

