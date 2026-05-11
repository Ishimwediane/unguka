async function runVerification() {
  const baseUrl = 'http://localhost:3000/v1';
  let token = '';
  let farmCropId = '';

  console.log('--- Phase 2 Verification ---');

  // 1. Login as a seeded farmer
  console.log('1. Logging in as farmer (+250783283577)...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_e164: '+250783283577', password: 'password123' })
  });
  const loginData = await loginRes.json();
  if (!loginData.access_token) {
    console.error('Login response:', loginData);
    throw new Error('Login failed');
  }
  token = loginData.access_token;
  console.log('✅ Login successful');

  // 2. Get Farmer Home Summary (Estimated Profit)
  console.log('\n2. Fetching Home Summary (Profit)...');
  const summaryRes = await fetch(`${baseUrl}/insights/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const summaryData = await summaryRes.json();
  console.log('Summary Data:', JSON.stringify(summaryData, null, 2));
  if (summaryData.estimated_profit_rwf === undefined) throw new Error('Profit calculation missing');
  console.log('✅ Home Summary working');

  // 3. Get Recommendations
  console.log('\n3. Fetching Recommendations...');
  const recRes = await fetch(`${baseUrl}/insights`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const recData = await recRes.json();
  console.log('First Recommendation:', JSON.stringify(recData[0], null, 2));
  if (!recData.length) throw new Error('No recommendations found');
  farmCropId = recData[0].farm_crop_id;
  console.log('✅ Recommendations working');

  // 4. Log an Expense
  console.log(`\n4. Logging an expense for crop ${farmCropId}...`);
  const expenseRes = await fetch(`${baseUrl}/farm-crops/${farmCropId}/expenses`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      category: 'labor',
      amount_rwf: 5000,
      occurred_on: '2026-05-11',
      note: 'Verification test expense'
    })
  });
  const expenseData = await expenseRes.json();
  console.log('Logged Expense:', expenseData);
  if (expenseData.amount_rwf !== 5000) throw new Error('Expense logging failed');
  console.log('✅ Expense logging working');

  // 5. Fetch Latest Prices
  const cropId = 'a1f01ef8-bbee-4b27-8d00-2aa400abd3d5'; // Tomato from seeds
  console.log(`\n5. Fetching latest prices for Tomato (${cropId})...`);
  const priceRes = await fetch(`${baseUrl}/prices?crop_id=${cropId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const priceData = await priceRes.json();
  console.log('First Price Entry:', JSON.stringify(priceData[0], null, 2));
  if (!priceData.length) throw new Error('Price data missing');
  console.log('✅ Price fetching working');

  // 6. Fetch Trending Crops
  console.log('\n6. Fetching trending crops...');
  const trendingRes = await fetch(`${baseUrl}/prices/trending`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const trendingData = await trendingRes.json();
  console.log('Trending Crops:', JSON.stringify(trendingData.slice(0, 3), null, 2));
  if (!trendingData.length) throw new Error('Trending data missing');
  console.log('✅ Trending logic working');

  // 7. Fetch Market Comparison
  console.log(`\n7. Fetching Market Comparison for ${farmCropId}...`);
  const comparisonRes = await fetch(`${baseUrl}/insights/market-comparison?farm_crop_id=${farmCropId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const comparisonData = await comparisonRes.json();
  if (comparisonData.statusCode && comparisonData.statusCode !== 200) {
    console.error('Comparison Error:', comparisonData);
    throw new Error('Comparison failed');
  }
  console.log('Market Comparison (Top 2):', JSON.stringify(comparisonData.slice(0, 2), null, 2));
  if (!comparisonData.length) throw new Error('Comparison data missing');
  if (comparisonData[0].estimated_profit_rwf === undefined) throw new Error('Profit calculation in comparison missing');
  console.log('✅ Market Comparison logic working');

  // 8. Test Price Feedback Loop
  console.log('\n8. Testing Price Feedback Loop...');
  // We'll use the cropId and farmCropId we got from the recommendations (step 3)
  const testCropId = recData[0].crop_id;
  
  const saleDto = {
    farm_crop_id: farmCropId,
    market_id: 'c1f0b667-562e-47f1-ba82-8a30e163854b', // Kimironko
    qty_kg: 100,
    price_per_kg_rwf: 1250,
    total_amount_rwf: 125000,
    sold_at: new Date()
  };

  await fetch(`${baseUrl}/sales`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(saleDto)
  });

  // Now check if the price for Kimironko for THIS crop is updated
  const updatedPricesRes = await fetch(`${baseUrl}/prices?crop_id=${testCropId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const updatedPrices = await updatedPricesRes.json();
  const kimironkoPrice = updatedPrices.find(p => p.market_id === 'c1f0b667-562e-47f1-ba82-8a30e163854b');
  
  console.log('New Kimironko Price:', kimironkoPrice.price_per_kg_rwf);
  if (kimironkoPrice.price_per_kg_rwf !== 1250) throw new Error('Feedback loop price not updated');
  console.log('✅ Price Feedback Loop working (Crowdsourcing enabled)');

  console.log('\n🎉 ALL USER STORIES VERIFIED SUCCESSFULLY!');
}

runVerification().catch(err => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
