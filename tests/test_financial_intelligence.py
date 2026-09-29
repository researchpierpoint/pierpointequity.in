import unittest
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"data"/"pipeline"))
import nse_financial_statements as fs

class FinancialStatementTests(unittest.TestCase):
    def test_local_name_and_number(self):
        self.assertEqual(fs.local("{urn:test}Revenue"),"revenue")
        self.assertEqual(fs.number("1,234.50"),1234.5)
    def test_classification(self):
        self.assertEqual(fs.classify("RevenueFromOperations"),"revenue")
        self.assertEqual(fs.classify("BasicEarningsPerShare"),"eps")

if __name__=="__main__":
    unittest.main()
