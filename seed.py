import asyncio
import asyncpg
from datetime import datetime, timedelta
import json
import os
from dotenv import load_dotenv

load_dotenv()
DB = os.getenv("DATABASE_URL")

async def seed():
    conn = await asyncpg.connect(DB)
    
    # Drop and recreate all tables first
    await conn.execute(open("schema.sql").read())
    
    # Clear existing data
    tables = ["milestones", "safety_plans", 
              "peer_messages", "peer_matches",
              "coping_favourites", "coping_completions",
              "assessments", "mood_entries", "users"]
    for table in tables:
        await conn.execute(f"DELETE FROM {table}")

    # Helper: days ago
    def dago(n, hour=9, minute=0):
        return datetime.now() - timedelta(
            days=n, hours=hour, minutes=minute
        )

    # ─────────────────────────────────────────────────────────
    # USER 1: A1B2-C3D4
    # ─────────────────────────────────────────────────────────
    await conn.execute("""
        INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    """, 'A1B2-C3D4', 'calm-river-moon-still', dago(45), ['academics','sleep','anxiety'], 'medium', 'dark', 14, dago(0))

    entries_u1 = [
        (1, 'Really low', 8, "Three exams this week and I haven't slept properly in four days. I keep telling myself I'll be fine but I don't actually believe it.", ['academics','sleep'], 'high', ['academics','sleep'], dago(28,23,0)),
        (1, 'Really low', 9, "Couldn't get out of bed until noon today. Not proud of it.", ['sleep','academics'], 'high', ['sleep'], dago(25,13,0)),
        (2, 'Not great', 6, "Submitted the assignment. Felt okay for about an hour then the next deadline hit.", ['academics'], 'medium', ['academics'], dago(22,20,0)),
        (2, 'Not great', 7, "Sat in the library for 4 hours and understood maybe 20 minutes worth of content.", ['academics','sleep'], 'medium', ['academics'], dago(20,16,0)),
        (3, 'Okay', 5, "Weekend. No alarms. Almost felt human.", ['sleep'], 'low', ['sleep'], dago(18,10,0)),
        (1, 'Really low', 8, "Exam tomorrow. Can't focus. Keep reading the same paragraph.", ['academics','anxiety'], 'high', ['academics'], dago(15,23,30)),
        (2, 'Not great', 6, "Exam done. Don't know how it went. Scared to find out.", ['academics'], 'medium', ['academics'], dago(14,11,0)),
        (3, 'Okay', 4, "Result wasn't bad. Not great. Enough to not spiral.", ['academics'], 'low', ['academics'], dago(12,15,0)),
        (4, 'Pretty good', 3, "Actually had a decent day. Went for a walk. Small wins I guess.", ['sleep'], 'low', [], dago(10,17,0)),
        (2, 'Not great', 7, "Next exam cycle starting. Here we go again.", ['academics','anxiety'], 'medium', ['academics'], dago(8,20,0)),
        (3, 'Okay', 5, "Doing the breathing thing before bed. Actually helps.", ['sleep'], 'low', [], dago(6,22,0)),
        (2, 'Not great', 6, "Group project falling apart. Nobody does their part.", ['academics','relationships'], 'medium', ['academics'], dago(4,19,0)),
        (3, 'Okay', 4, "Okay day. Ate properly. Slept okay. Bar is low but cleared it.", [], 'low', [], dago(2,20,0)),
        (4, 'Pretty good', 3, "Felt good today. Clear head. Didn't last but it was real.", [], 'low', [], dago(1,18,0)),
    ]
    for e in entries_u1:
        await conn.execute("""
            INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        """, 'A1B2-C3D4', *e)

    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,interpretation,coping_priorities,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""",
        'A1B2-C3D4', 'PHQ-9', 16, 'Moderately Severe', json.dumps([2,2,3,2,1,2,2,1,1]), 'Your score suggests significant depressive symptoms. Sleep and academic pressure appear to be key contributors.', ['breathing','cbt'], dago(20))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,interpretation,coping_priorities,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""",
        'A1B2-C3D4', 'GAD-7', 18, 'Severe', json.dumps([3,3,2,3,3,2,2]), 'Severe anxiety detected. Breathing exercises and structured thinking exercises are strongly recommended.', ['breathing','grounding'], dago(6))

    for (eid, ename, ecat, edur), count in zip([('breathing-478', '4-7-8 Breathing', 'breathing', 3), ('body-scan', 'Body Scan', 'movement', 8), ('thought-record', 'Thought Record', 'cbt', 10)], [12, 3, 2]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'A1B2-C3D4', eid, ename, ecat, edur, dago(count - i))

    for eid in ['breathing-478', 'body-scan']:
        await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'A1B2-C3D4', eid)

    await conn.execute("""INSERT INTO safety_plans VALUES ($1,$2,$3,$4,$5,$6,$7)""", 'A1B2-C3D4', 'Do the breathing exercise and text my roommate', 'Call home', 'Go outside even for 5 minutes', 'Rohan', '9876543210', dago(15))

    for mid in ['first-checkin','seven-day-streak','first-assessment']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'A1B2-C3D4', mid, dago(20))


    # ─────────────────────────────────────────────────────────
    # USER 2: E5F6-G7H8
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'E5F6-G7H8', 'silver-lamp-quiet-tide', dago(30), ['loneliness','relationships','anxiety'], 'medium', 'dark', 6, dago(0))
    
    entries_u2 = [
        (1, 'Really low', 8, "Sat in the cafeteria alone again.", ['loneliness'], 'high', [], dago(25)),
        (1, 'Really low', 7, "Miss my dogs.", ['loneliness'], 'medium', [], dago(23)),
        (2, 'Not great', 6, "Called mom for an hour. Felt okay after.", ['relationships'], 'medium', [], dago(20)),
        (2, 'Not great', 6, "Just watching netflix.", [], 'low', [], dago(18)),
        (2, 'Not great', 5, "Went to a club meeting today. Stood near the wall.", ['anxiety'], 'medium', [], dago(15)),
        (2, 'Not great', 5, "Class was okay.", [], 'low', [], dago(10)),
        (3, 'Okay', 4, "It rained today, which was nice.", [], 'low', [], dago(7)),
        (3, 'Okay', 4, "Ate lunch outside.", [], 'low', [], dago(4)),
        (3, 'Okay', 3, "Used the peer connect thing. Easier somehow.", ['relationships','loneliness'], 'low', [], dago(2)),
        (3, 'Okay', 3, "Slept better.", ['sleep'], 'low', [], dago(1)),
    ]
    for e in entries_u2:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'E5F6-G7H8', *e)
        
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'E5F6-G7H8', 'PHQ-9', 13, 'Moderate', json.dumps([2,1,2,2,1,2,1,1,1]), dago(15))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'E5F6-G7H8', 'GAD-7', 11, 'Moderate', json.dumps([2,2,1,2,1,2,1]), dago(14))
    
    for (eid, ename, ecat, edur), count in zip([('grounding-54321', '5-4-3-2-1 Grounding', 'anxiety', 5), ('gratitude-log', 'Gratitude Log', 'reflection', 5)], [8, 5]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'E5F6-G7H8', eid, ename, ecat, edur, dago(count - i))
    await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'E5F6-G7H8', 'gratitude-log')
    for mid in ['first-checkin','first-connection']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'E5F6-G7H8', mid, dago(20))


    # ─────────────────────────────────────────────────────────
    # USER 3: I9J0-K1L2
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'I9J0-K1L2', 'amber-stone-deep-well', dago(40), ['burnout','academics','sleep'], 'medium', 'dark', 14, dago(0))
    entries_u3 = [
        (3, 'Okay', 5, "Another day. Did everything. Feel nothing.", ['burnout'], 'low', [], dago(25)),
        (3, 'Okay', 4, "People keep asking if I'm excited about graduating.", ['academics'], 'low', [], dago(22)),
        (3, 'Okay', 5, "Finished the paper. No relief, just checked a box.", ['burnout','academics'], 'low', [], dago(19)),
        (3, 'Okay', 4, "Slept 9 hours and woke up tired.", ['sleep'], 'low', [], dago(16)),
        (3, 'Okay', 4, "Lunch was fine.", [], 'low', [], dago(13)),
        (3, 'Okay', 5, "Stared at the screen for two hours.", ['burnout'], 'low', [], dago(10)),
        (4, 'Pretty good', 3, "Had chai with a friend. Felt real for a second.", ['relationships'], 'low', [], dago(8)),
        (3, 'Okay', 4, "Back to neutral.", [], 'low', [], dago(6)),
        (3, 'Okay', 5, "Just existing.", ['burnout'], 'low', [], dago(4)),
        (3, 'Okay', 4, "Checked in.", [], 'low', [], dago(1)),
    ]
    for e in entries_u3:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'I9J0-K1L2', *e)

    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'I9J0-K1L2', 'PHQ-9', 8, 'Mild', json.dumps([1,1,1,1,1,1,1,0,1]), dago(30))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'I9J0-K1L2', 'PHQ-9', 9, 'Mild', json.dumps([1,1,2,1,1,1,1,0,1]), dago(5))
    
    for (eid, ename, ecat, edur), count in zip([('box-breathing', 'Box Breathing', 'breathing', 5), ('thought-record', 'Thought Record', 'cbt', 10)], [20, 1]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'I9J0-K1L2', eid, ename, ecat, edur, dago(count - i))
    await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'I9J0-K1L2', 'box-breathing')
    for mid in ['first-checkin','seven-day-streak','coping-explorer']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'I9J0-K1L2', mid, dago(20))


    # ─────────────────────────────────────────────────────────
    # USER 4: M3N4-O5P6
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'M3N4-O5P6', 'forest-dusk-plain-hour', dago(60), ['relationships','loneliness','sleep'], 'medium', 'dark', 21, dago(0))
    entries_u4 = [
        (1, 'Really low', 9, "I don't understand how someone can just decide they're done. Three years.", ['relationships','loneliness'], 'high', [], dago(42)),
        (1, 'Really low', 8, "Cried in the library today.", ['relationships'], 'high', [], dago(38)),
        (2, 'Not great', 7, "Everything reminds me of them.", ['loneliness'], 'medium', [], dago(34)),
        (2, 'Not great', 6, "Deleted our photos. Took an hour. Done now.", ['relationships'], 'medium', [], dago(28)),
        (2, 'Not great', 6, "Slept okay for once.", ['sleep'], 'low', [], dago(21)),
        (3, 'Okay', 5, "Working on an assignment. Distracted but functioning.", [], 'low', [], dago(15)),
        (3, 'Okay', 4, "Went out with friends. Wasn't miserable. Progress.", ['relationships'], 'low', [], dago(10)),
        (4, 'Pretty good', 3, "Had a good day. Didn't think about it until just now.", [], 'low', [], dago(5)),
        (4, 'Pretty good', 3, "Laughing again.", [], 'low', [], dago(2)),
        (4, 'Pretty good', 2, "It gets easier.", [], 'low', [], dago(1)),
    ]
    for e in entries_u4:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'M3N4-O5P6', *e)

    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'M3N4-O5P6', 'PHQ-9', 19, 'Moderately Severe', json.dumps([2,3,3,2,2,2,2,1,2]), dago(35))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'M3N4-O5P6', 'PHQ-9', 9, 'Mild', json.dumps([1,1,2,1,1,1,1,0,1]), dago(7))
    
    for (eid, ename, ecat, edur), count in zip([('thought-record', 'Thought Record', 'cbt', 10), ('breathing-478', '4-7-8 Breathing', 'breathing', 3), ('gratitude-log', 'Gratitude Log', 'reflection', 5)], [15, 10, 8]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'M3N4-O5P6', eid, ename, ecat, edur, dago(count - i))
    
    for eid in ['thought-record', 'gratitude-log']:
        await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'M3N4-O5P6', eid)
        
    await conn.execute("""INSERT INTO safety_plans VALUES ($1,$2,$3,$4,$5,$6,$7)""", 'M3N4-O5P6', 'Call my sister', 'Go for a run', 'Write it out — don\'t hold it in', 'Priya', '9988776655', dago(35))

    for mid in ['first-checkin','seven-day-streak','first-assessment','first-connection','coping-explorer','safety-plan-created']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'M3N4-O5P6', mid, dago(20))


    # ─────────────────────────────────────────────────────────
    # USER 5: Q7R8-S9T0
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'Q7R8-S9T0', 'night-leaf-slow-mist', dago(25), ['anxiety','academics','burnout'], 'medium', 'dark', 18, dago(0))
    entries_u5 = [
        (2, 'Not great', 6, "Can't stop making lists. Lists of lists.", ['anxiety'], 'medium', [], dago(22)),
        (2, 'Not great', 7, "Too much to do.", ['academics','anxiety'], 'high', [], dago(20)),
        (4, 'Pretty good', 3, "Presented today. Already worried about the next one.", ['academics','anxiety'], 'medium', [], dago(17)),
        (2, 'Not great', 6, "Worrying again.", ['anxiety'], 'medium', [], dago(15)),
        (3, 'Okay', 5, "Studied for 6 hours.", ['academics'], 'low', [], dago(12)),
        (4, 'Pretty good', 2, "Got highest score. Felt nothing.", ['academics','burnout'], 'low', [], dago(9)),
        (2, 'Not great', 6, "Took a day off. Felt guilty the whole time.", ['burnout','anxiety'], 'medium', [], dago(7)),
        (3, 'Okay', 4, "Okay day.", [], 'low', [], dago(5)),
        (2, 'Not great', 5, "Racing thoughts.", ['anxiety'], 'medium', [], dago(2)),
        (3, 'Okay', 4, "Logging off.", [], 'low', [], dago(1)),
    ]
    for e in entries_u5:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'Q7R8-S9T0', *e)
        
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'Q7R8-S9T0', 'GAD-7', 16, 'Severe', json.dumps([2,3,3,2,2,2,2]), dago(20))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'Q7R8-S9T0', 'PHQ-9', 7, 'Mild', json.dumps([1,1,1,1,1,0,1,0,1]), dago(18))
    
    for (eid, ename, ecat, edur), count in zip([('thought-record', 'Thought Record', 'cbt', 10), ('breathing-478', '4-7-8 Breathing', 'breathing', 3), ('box-breathing', 'Box Breathing', 'breathing', 5)], [18, 14, 9]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'Q7R8-S9T0', eid, ename, ecat, edur, dago(count - i))
    for eid in ['thought-record', 'breathing-478']:
        await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'Q7R8-S9T0', eid)
    for mid in ['first-checkin','seven-day-streak','first-assessment','coping-explorer']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'Q7R8-S9T0', mid, dago(15))


    # ─────────────────────────────────────────────────────────
    # USER 6: U1V2-W3X4
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'U1V2-W3X4', 'copper-tide-warm-rain', dago(20), ['loneliness','academics','sleep'], 'medium', 'dark', 11, dago(0))
    entries_u6 = [
        (2, 'Not great', 7, "Always the one checking on others. Nobody checks on me.", ['loneliness'], 'medium', [], dago(18)),
        (2, 'Not great', 6, "Tired.", ['sleep'], 'low', [], dago(16)),
        (3, 'Okay', 5, "Class was fine.", ['academics'], 'low', [], dago(14)),
        (2, 'Not great', 6, "Skipped class. Couldn't make myself go.", ['academics'], 'medium', [], dago(12)),
        (3, 'Okay', 4, "Slept all day.", ['sleep'], 'low', [], dago(10)),
        (4, 'Pretty good', 3, "Peer connect helped today.", ['loneliness'], 'low', [], dago(8)),
        (3, 'Okay', 4, "Neutral.", [], 'low', [], dago(6)),
        (4, 'Pretty good', 3, "Helped someone in peer connect. Felt good.", ['loneliness'], 'low', [], dago(4)),
        (3, 'Okay', 4, "Studying.", ['academics'], 'low', [], dago(2)),
        (4, 'Pretty good', 3, "Actually feeling okay.", [], 'low', [], dago(1)),
    ]
    for e in entries_u6:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'U1V2-W3X4', *e)
        
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'U1V2-W3X4', 'PHQ-9', 11, 'Moderate', json.dumps([2,1,2,1,1,2,1,0,1]), dago(15))
    
    for (eid, ename, ecat, edur), count in zip([('gratitude-log', 'Gratitude Log', 'reflection', 5), ('grounding-54321', '5-4-3-2-1 Grounding', 'anxiety', 5)], [11, 7]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'U1V2-W3X4', eid, ename, ecat, edur, dago(count - i))
    await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'U1V2-W3X4', 'gratitude-log')
    for mid in ['first-checkin','first-assessment','first-connection']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'U1V2-W3X4', mid, dago(10))

    # PEER MATCH: User 2 (E5F6-G7H8) & User 6 (U1V2-W3X4)
    res = await conn.fetchrow("""INSERT INTO peer_matches (user_a, user_b, matched_at, active) VALUES ($1,$2,$3,$4) RETURNING id""", 'E5F6-G7H8', 'U1V2-W3X4', dago(10), True)
    match_id = res['id']
    await conn.execute("""INSERT INTO peer_messages (match_id, sender_id, message_text, sent_at) VALUES ($1,$2,$3,$4)""", match_id, 'E5F6-G7H8', "hey, first year here too. finding it really hard to meet people", dago(9))
    await conn.execute("""INSERT INTO peer_messages (match_id, sender_id, message_text, sent_at) VALUES ($1,$2,$3,$4)""", match_id, 'U1V2-W3X4', "same honestly. it gets better apparently. or that's what they say", dago(8, 8, 30))
    await conn.execute("""INSERT INTO peer_messages (match_id, sender_id, message_text, sent_at) VALUES ($1,$2,$3,$4)""", match_id, 'E5F6-G7H8', "lol yeah. at least we're not alone in being alone i guess", dago(8, 7, 0))


    # ─────────────────────────────────────────────────────────
    # USER 7: Y5Z6-A7B8
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'Y5Z6-A7B8', 'plain-echo-glass-dew', dago(8), ['anxiety','academics'], 'medium', 'dark', 3, dago(0))
    entries_u7 = [
        (3, 'Okay', 4, "Trying this app out. Not sure what to write.", [], 'low', [], dago(7)),
        (2, 'Not great', 6, "Anxious about tomorrow's lab. Probably fine.", ['anxiety','academics'], 'medium', [], dago(6)),
        (3, 'Okay', 5, "It wasn't fine lol. But I survived.", ['academics'], 'low', [], dago(5)),
        (3, 'Okay', 4, "Getting used to writing here. Kind of helps.", [], 'low', [], dago(3)),
        (3, 'Okay', 4, "Normal day.", [], 'low', [], dago(2)),
        (4, 'Pretty good', 3, "Lab went better today.", ['academics'], 'low', [], dago(1)),
    ]
    for e in entries_u7:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'Y5Z6-A7B8', *e)
        
    for i in range(2):
        await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'Y5Z6-A7B8', 'breathing-478', '4-7-8 Breathing', 'breathing', 3, dago(i))
    await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'Y5Z6-A7B8', 'first-checkin', dago(7))


    # ─────────────────────────────────────────────────────────
    # USER 8: C9D0-E1F2
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'C9D0-E1F2', 'hollow-bridge-soft-gale', dago(40), ['burnout','relationships','academics'], 'medium', 'dark', 8, dago(0))
    entries_u8 = [
        (2, 'Not great', 6, "Third meeting that could've been an email.", ['burnout','academics'], 'medium', [], dago(35)),
        (2, 'Not great', 7, "Snapped at a colleague. Stress making me someone I don't like.", ['relationships','burnout'], 'high', [], dago(28)),
        (1, 'Really low', 8, "Took a half day. Manager wasn't happy. I don't care.", ['burnout'], 'high', [], dago(21)),
        (3, 'Okay', 5, "Weekend.", [], 'low', [], dago(18)),
        (2, 'Not great', 6, "Running on caffeine and stubbornness.", ['burnout'], 'medium', [], dago(14)),
        (2, 'Not great', 5, "Exhausted.", ['burnout'], 'medium', [], dago(10)),
        (3, 'Okay', 4, "Actually got some sleep.", [], 'low', [], dago(7)),
        (3, 'Okay', 5, "Work is piling up.", ['academics'], 'low', [], dago(4)),
        (2, 'Not great', 6, "Can't keep this pace up.", ['burnout'], 'medium', [], dago(2)),
        (3, 'Okay', 4, "Surviving.", [], 'low', [], dago(1)),
    ]
    for e in entries_u8:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'C9D0-E1F2', *e)
        
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'C9D0-E1F2', 'GAD-7', 13, 'Moderate', json.dumps([2,2,2,1,2,2,2]), dago(20))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'C9D0-E1F2', 'PHQ-9', 10, 'Moderate', json.dumps([1,2,2,1,1,1,1,0,1]), dago(19))
    
    for (eid, ename, ecat, edur), count in zip([('box-breathing', 'Box Breathing', 'breathing', 5), ('body-scan', 'Body Scan', 'movement', 8)], [6, 4]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'C9D0-E1F2', eid, ename, ecat, edur, dago(count - i))
    await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'C9D0-E1F2', 'box-breathing')
    for mid in ['first-checkin','first-assessment']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'C9D0-E1F2', mid, dago(30))


    # ─────────────────────────────────────────────────────────
    # USER 9: G3H4-I5J6
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'G3H4-I5J6', 'dusk-marrow-still-pine', dago(35), ['loneliness','burnout','sleep'], 'medium', 'dark', 18, dago(0))
    entries_u9 = [
        (2, 'Not great', 7, "Textbook says increased sleep is a symptom. Slept 11 hours. Checked that box.", ['sleep','burnout'], 'medium', [], dago(28)),
        (2, 'Not great', 6, "The irony of studying mental health while struggling isn't lost on me.", ['burnout'], 'medium', [], dago(25)),
        (3, 'Okay', 5, "Studied all day.", ['academics'], 'low', [], dago(22)),
        (4, 'Pretty good', 3, "Had a real conversation. Not about mental health. Just talked.", ['loneliness'], 'low', [], dago(18)),
        (2, 'Not great', 6, "3AM again. Pattern I'm too tired to break.", ['sleep'], 'medium', [], dago(14)),
        (3, 'Okay', 4, "Woke up at noon.", ['sleep'], 'low', [], dago(10)),
        (3, 'Okay', 5, "Feeling detached.", ['burnout'], 'low', [], dago(7)),
        (2, 'Not great', 6, "Overthinking everything.", ['anxiety'], 'medium', [], dago(4)),
        (3, 'Okay', 4, "Did the reading.", [], 'low', [], dago(2)),
        (3, 'Okay', 4, "Checking in.", [], 'low', [], dago(1)),
    ]
    for e in entries_u9:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'G3H4-I5J6', *e)
        
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'G3H4-I5J6', 'PHQ-9', 12, 'Moderate', json.dumps([2,1,2,2,1,1,1,1,1]), dago(30))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'G3H4-I5J6', 'GAD-7', 8, 'Mild', json.dumps([1,1,1,2,1,1,1]), dago(29))
    
    for (eid, ename, ecat, edur), count in zip([('thought-record', 'Thought Record', 'cbt', 10), ('gratitude-log', 'Gratitude Log', 'reflection', 5), ('grounding-54321', '5-4-3-2-1 Grounding', 'anxiety', 5)], [9, 7, 5]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'G3H4-I5J6', eid, ename, ecat, edur, dago(count - i))
    await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'G3H4-I5J6', 'thought-record')
    await conn.execute("""INSERT INTO safety_plans VALUES ($1,$2,$3,$4,$5,$6,$7)""", 'G3H4-I5J6', 'Write it down before I spiral', 'Call Diya', 'Go to the department common room', 'Diya', '9123456780', dago(20))
    for mid in ['first-checkin','seven-day-streak','first-assessment','first-connection','coping-explorer']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'G3H4-I5J6', mid, dago(15))


    # ─────────────────────────────────────────────────────────
    # USER 10: K7L8-M9N0
    # ─────────────────────────────────────────────────────────
    await conn.execute("""INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8)""", 'K7L8-M9N0', 'green-vault-open-sea', dago(50), ['academics','sleep'], 'medium', 'dark', 28, dago(0))
    entries_u10 = [
        (4, 'Pretty good', 3, "Slept by 11, up by 7. Banking this feeling.", ['sleep'], 'low', [], dago(30)),
        (3, 'Okay', 4, "Good workout.", [], 'low', [], dago(26)),
        (4, 'Pretty good', 3, "Exam week coming. Nowhere near last year. Progress.", ['academics'], 'low', [], dago(21)),
        (3, 'Okay', 4, "Studying.", ['academics'], 'low', [], dago(16)),
        (5, 'Really good', 2, "Aced the test.", ['academics'], 'low', [], dago(12)),
        (3, 'Okay', 4, "Did the breathing before the viva. Skeptic converted.", ['academics'], 'low', [], dago(9)),
        (4, 'Pretty good', 3, "Nice relaxing weekend.", [], 'low', [], dago(6)),
        (4, 'Pretty good', 3, "Reading a book.", [], 'low', [], dago(4)),
        (5, 'Really good', 2, "Checked in every day this week. Small thing but it matters.", [], 'low', [], dago(2)),
        (4, 'Pretty good', 3, "Ready for the week.", [], 'low', [], dago(1)),
    ]
    for e in entries_u10:
        await conn.execute("""INSERT INTO mood_entries (user_id, mood_score, mood_label, intensity, journal_text, tags, distress_level, auto_tags, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)""", 'K7L8-M9N0', *e)
        
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'K7L8-M9N0', 'PHQ-9', 4, 'Minimal', json.dumps([0,1,1,0,1,0,0,0,1]), dago(20))
    await conn.execute("""INSERT INTO assessments (user_id,type,score,severity,answers,created_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'K7L8-M9N0', 'GAD-7', 5, 'Minimal', json.dumps([1,1,1,0,1,0,1]), dago(19))
    
    for (eid, ename, ecat, edur), count in zip([('breathing-478', '4-7-8 Breathing', 'breathing', 3), ('body-scan', 'Body Scan', 'movement', 8), ('box-breathing', 'Box Breathing', 'breathing', 5), ('gratitude-log', 'Gratitude Log', 'reflection', 5)], [22, 12, 8, 10]):
        for i in range(count):
            await conn.execute("""INSERT INTO coping_completions (user_id,exercise_id,exercise_name,category,duration_mins,completed_at) VALUES ($1,$2,$3,$4,$5,$6)""", 'K7L8-M9N0', eid, ename, ecat, edur, dago(count - i))
    for eid in ['breathing-478', 'body-scan', 'gratitude-log']:
        await conn.execute("""INSERT INTO coping_favourites VALUES ($1,$2)""", 'K7L8-M9N0', eid)
    for mid in ['first-checkin','seven-day-streak','first-assessment','first-connection','coping-explorer','safety-plan-created']:
        await conn.execute("""INSERT INTO milestones VALUES ($1,$2,$3)""", 'K7L8-M9N0', mid, dago(25))

    await conn.close()
    print("\nCalmPulse database seeded.")
    print("10 users, full synthetic dataset loaded.")

if __name__ == "__main__":
    asyncio.run(seed())
