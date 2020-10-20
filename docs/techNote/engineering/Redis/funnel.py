import time

class Funnel(object):
  def __init__(self, capacity, leaking_rate):
    self.capacity = capacity # 漏斗容量
    self.leaking_rate = leaking_rate # 漏嘴流水速率
    self.left_quota = capacity # 漏斗剩余空间
    self.leaking_ts = time.time() # 上一次漏水时间
  
  def make_space(self):
    now_ts = time.time()
    delta_ts = now_ts - self.leaking_ts
    delta_quota = delta_ts * self.leaking_rate
    if delta_quota > 1: # 已经腾出了足够的空间
      self.left_quota += delta_quota # 增加剩余空间
      self.leaking_ts = now_ts # 记录漏水时间
    # 剩余空间不得高于容量 
    self.left_quota = min(self.left_quota, self.capacity)
  
  def watering(self, quota):
    self.make_space()
    if self.left_quota >= quota:
        self.left_quota -= quota
        return True
    return False

# 所有的漏斗集合
funnels = {}

def is_action_allowed(user_id, action_key, capacity, leaking_rate):
  key = '%s:%s' % (user_id, action_key)
  funnel = funnels.get(key)
  if not funnel:
    funnel = Funnel(capacity, leaking_rate)
    funnels[key] = funnel
  return funnel.watering(1)

for i in range(20):
  time.sleep(0.3)
  print(is_action_allowed('lyj', 'reply', 5, 0.5))