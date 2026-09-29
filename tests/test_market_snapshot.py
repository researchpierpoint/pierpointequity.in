import unittest
from data.pipeline.market_snapshot import parse

class MarketSnapshotTests(unittest.TestCase):
    def test_parse_eq_rows_and_numbers(self):
        text="""SYMBOL,SERIES,DATE1,PREV_CLOSE,OPEN_PRICE,HIGH_PRICE,LOW_PRICE,LAST_PRICE,CLOSE_PRICE,AVG_PRICE,TTL_TRD_QNTY,TURNOVER_LACS,NO_OF_TRADES,DELIV_QTY,DELIV_PER
ABC,EQ,30-Sep-2026,100,101,105,99,104,103,102,10000,1020,500,6000,60
BOND,GS,30-Sep-2026,100,101,105,99,104,103,102,10000,1020,500,6000,60
"""
        rows=parse(text, min_rows=1)
        self.assertEqual(len(rows),1)
        self.assertEqual(rows[0]["symbol"],"ABC")
        self.assertEqual(rows[0]["close"],103.0)
        self.assertEqual(rows[0]["delivery_pct"],60.0)

if __name__=="__main__": unittest.main()
