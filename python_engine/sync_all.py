"""
NBA 数据同步主入口脚本
用法:
  python sync_all.py          # 完整同步（包括赛程、球员资料、赛季数据等）
  python sync_all.py --quick  # 快速同步（仅同步今日比赛和比分）
"""
import subprocess
import sys
import os

# 切换到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def run_script(script_name):
    """运行指定的 Python 脚本"""
    print(f"\n{'='*50}")
    print(f"正在运行: {script_name}")
    print('='*50)
    result = subprocess.run([sys.executable, script_name], capture_output=False)
    return result.returncode == 0

def full_sync():
    """完整同步所有数据"""
    scripts = [
        'sync_games.py',           # 同步赛程
        'sync_player_profiles.py', # 同步球员资料
        'sync_player_stats.py',    # 同步球员赛季数据
        'sync_team_stats.py',      # 同步球队赛季数据
        'sync_game_logs.py',       # 同步今日比赛球员数据
        'sync_quarter_scores.py',  # 同步单节比分
        'sync_news.py',            # 同步新闻
    ]
    
    for script in scripts:
        if os.path.exists(script):
            run_script(script)
        else:
            print(f"⚠️ 跳过不存在的脚本: {script}")
    
    print("\n🎉 完整同步完成！")

def quick_sync():
    """快速同步（仅今日数据）"""
    scripts = [
        'sync_game_logs.py',       # 同步今日比赛球员数据
        'sync_quarter_scores.py',  # 同步单节比分
    ]
    
    for script in scripts:
        if os.path.exists(script):
            run_script(script)
        else:
            print(f"⚠️ 跳过不存在的脚本: {script}")
    
    print("\n🎉 快速同步完成！")

if __name__ == '__main__':
    if '--quick' in sys.argv or '-q' in sys.argv:
        print("=== 快速同步模式 ===")
        quick_sync()
    else:
        print("=== 完整同步模式 ===")
        full_sync()
