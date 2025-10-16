-- Row Level Security Policies

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Calculations policies
CREATE POLICY "Users can view own calculations"
  ON calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations"
  ON calculations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON calculations FOR DELETE
  USING (auth.uid() = user_id);

-- Tenders policies
CREATE POLICY "Anyone can view open tenders"
  ON tenders FOR SELECT
  USING (status = 'open' OR auth.uid() = user_id);

CREATE POLICY "Users can insert own tenders"
  ON tenders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tenders"
  ON tenders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tenders"
  ON tenders FOR DELETE
  USING (auth.uid() = user_id);

-- Bids policies
CREATE POLICY "Tender owners and bidders can view bids"
  ON bids FOR SELECT
  USING (
    auth.uid() = contractor_id OR
    auth.uid() IN (SELECT user_id FROM tenders WHERE id = tender_id)
  );

CREATE POLICY "Contractors can insert bids"
  ON bids FOR INSERT
  WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Contractors can update own bids"
  ON bids FOR UPDATE
  USING (auth.uid() = contractor_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they send"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Hardware stores policies
CREATE POLICY "Anyone can view hardware stores"
  ON hardware_stores FOR SELECT
  USING (true);
