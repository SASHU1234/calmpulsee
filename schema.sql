CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(9) PRIMARY KEY,
  passphrase    VARCHAR(255) UNIQUE NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  tags          TEXT[],
  font_size     VARCHAR(10) DEFAULT 'medium',
  theme         VARCHAR(10) DEFAULT 'dark',
  streak        INTEGER DEFAULT 0,
  last_active   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mood_entries (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(9) REFERENCES users(id),
  mood_score    INTEGER NOT NULL,
  mood_label    VARCHAR(50),
  intensity     INTEGER,
  journal_text  TEXT,
  tags          TEXT[],
  distress_level VARCHAR(10),
  auto_tags     TEXT[],
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessments (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(9) REFERENCES users(id),
  type          VARCHAR(10) NOT NULL,
  score         INTEGER NOT NULL,
  severity      VARCHAR(20),
  answers       JSONB,
  interpretation TEXT,
  coping_priorities TEXT[],
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coping_completions (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(9) REFERENCES users(id),
  exercise_id   VARCHAR(50),
  exercise_name VARCHAR(100),
  category      VARCHAR(50),
  duration_mins INTEGER,
  completed_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coping_favourites (
  user_id       VARCHAR(9) REFERENCES users(id),
  exercise_id   VARCHAR(50),
  PRIMARY KEY (user_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS peer_matches (
  id            SERIAL PRIMARY KEY,
  user_a        VARCHAR(9) REFERENCES users(id),
  user_b        VARCHAR(9) REFERENCES users(id),
  matched_at    TIMESTAMP DEFAULT NOW(),
  active        BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS peer_messages (
  id            SERIAL PRIMARY KEY,
  match_id      INTEGER REFERENCES peer_matches(id),
  sender_id     VARCHAR(9) REFERENCES users(id),
  message_text  TEXT,
  flagged       BOOLEAN DEFAULT FALSE,
  flag_reason   TEXT,
  sent_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS safety_plans (
  user_id       VARCHAR(9) PRIMARY KEY 
                REFERENCES users(id),
  step_one      TEXT,
  step_two      TEXT,
  step_three    TEXT,
  trusted_name  VARCHAR(100),
  trusted_phone VARCHAR(20),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
  user_id       VARCHAR(9) REFERENCES users(id),
  milestone_id  VARCHAR(50),
  earned_at     TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, milestone_id)
);
