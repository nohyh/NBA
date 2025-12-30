"""
NBA 数据综合同步脚本
用于定时更新所有数据（网站上线后配合 cron/scheduler 使用）

包含的同步任务：
1. sync_games - 同步比赛赛程（含 UTC 时间转换）
2. update_scores - 更新今日比赛比分
3. sync_game_logs - 同步今日球员单场数据（用于 MVP）
4. sync_history_game_logs - 同步历史比赛球员数据
5. sync_player_stats - 同步球员赛季统计
6. sync_team_stats - 同步球队赛季统计
7. sync_quarter_scores - 同步四节比分
8. sync_news - 同步 NBA 新闻

用法:
  python sync_all.py              # 运行所有同步任务
  python sync_all.py --quick      # 只更新今日数据（比分、单场数据）
  python sync_all.py --full       # 完整同步所有赛季数据
"""
import subprocess
import sys
import os
import time
from datetime import datetime

# 切换到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def run_script(script_name, args=None, description=""):
    """运行指定的 Python 脚本"""
    cmd = [sys.executable, script_name]
    if args:
        cmd.extend(args)
    
    print(f"\n{'='*60}")
    print(f"🔄 {description or script_name}")
    print(f"{'='*60}")
    
    start_time = time.time()
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        elapsed = time.time() - start_time
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(f"⚠️ 警告: {result.stderr}")
        
        if result.returncode == 0:
            print(f"✅ 完成 ({elapsed:.1f}s)")
            return True
        else:
            print(f"❌ 失败 (退出码: {result.returncode})")
            return False
    except subprocess.TimeoutExpired:
        print(f"❌ 超时 (>300s)")
        return False
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

def sync_quick():
    """快速同步 - 只更新今日数据"""
    print("\n" + "="*60)
    print("⚡ 快速同步模式 - 更新今日数据")
    print("="*60)
    
    results = []
    
    # 1. 更新今日比分
    results.append(("比分更新", run_script("update_scores.py", description="更新今日比分")))
    
    # 2. 同步今日球员单场数据
    results.append(("球员单场数据", run_script("sync_game_logs.py", description="同步今日球员单场数据")))
    
    return results

def sync_daily():
    """每日同步 - 更新赛程、比分、当前赛季数据"""
    print("\n" + "="*60)
    print("📅 每日同步模式")
    print("="*60)
    
    results = []
    
    # 1. 同步比赛赛程
    results.append(("比赛赛程", run_script("sync_games.py", description="同步比赛赛程")))
    
    # 2. 更新今日比分
    results.append(("比分更新", run_script("update_scores.py", description="更新今日比分")))
    
    # 3. 同步今日球员单场数据
    results.append(("今日球员数据", run_script("sync_game_logs.py", description="同步今日球员单场数据")))
    
    # 4. 同步历史比赛球员数据（补充缺失的）
    results.append(("历史比赛数据", run_script("sync_history_game_logs.py", description="同步历史比赛球员数据")))
    
    # 5. 同步当前赛季球员统计
    results.append(("球员赛季统计", run_script("sync_player_stats.py", description="同步当前赛季球员统计")))
    time.sleep(2)  # 避免 API 限流
    
    # 6. 同步当前赛季球队统计
    results.append(("球队赛季统计", run_script("sync_team_stats.py", description="同步当前赛季球队统计")))
    
    # 7. 同步四节比分
    results.append(("四节比分", run_script("sync_quarter_scores.py", description="同步四节比分")))
    
    # 8. 同步新闻
    results.append(("新闻同步", run_script("sync_news.py", description="同步 NBA 新闻")))
    
    return results


def sync_full():
    """完整同步 - 同步所有历史赛季数据"""
    print("\n" + "="*60)
    print("🏀 完整同步模式 - 同步所有赛季")
    print("="*60)
    
    results = []
    
    # 1. 同步比赛赛程
    results.append(("比赛赛程", run_script("sync_games.py", description="同步比赛赛程")))
    
    # 2. 更新今日比分
    results.append(("比分更新", run_script("update_scores.py", description="更新今日比分")))
    
    # 3. 同步今日球员单场数据
    results.append(("球员单场数据", run_script("sync_game_logs.py", description="同步今日球员单场数据")))
    
    # 4. 同步所有赛季球员统计
    results.append(("球员赛季统计(全)", run_script("sync_player_stats.py", ["--all"], description="同步所有赛季球员统计")))
    time.sleep(2)
    
    # 5. 同步所有赛季球队统计
    results.append(("球队赛季统计(全)", run_script("sync_team_stats.py", ["--all"], description="同步所有赛季球队统计")))
    
    return results

def print_summary(results):
    """打印同步结果摘要"""
    print("\n" + "="*60)
    print("📊 同步结果摘要")
    print("="*60)
    
    success_count = sum(1 for _, success in results if success)
    total_count = len(results)
    
    for name, success in results:
        status = "✅" if success else "❌"
        print(f"  {status} {name}")
    
    print(f"\n{'='*60}")
    print(f"总计: {success_count}/{total_count} 成功")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

if __name__ == "__main__":
    start = time.time()
    
    if len(sys.argv) > 1:
        mode = sys.argv[1]
        if mode == "--quick":
            results = sync_quick()
        elif mode == "--full":
            results = sync_full()
        else:
            print(f"未知参数: {mode}")
            print("用法: python sync_all.py [--quick|--full]")
            sys.exit(1)
    else:
        # 默认每日同步
        results = sync_daily()
    
    print_summary(results)
    
    elapsed = time.time() - start
    print(f"\n⏱️ 总耗时: {elapsed:.1f}s")
