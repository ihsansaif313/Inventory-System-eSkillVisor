<?php
/**
 * Company Matcher Service
 * Handles company name matching and resolution
 */

class CompanyMatcher {
    
    public static function findBestMatch($companyName) {
        // Get all companies from database
        $db = Database::getInstance();
        $companies = $db->fetchAll("SELECT * FROM companies WHERE status = 'active'");
        
        $bestMatch = null;
        $highestScore = 0;
        
        foreach ($companies as $company) {
            $score = self::calculateSimilarity($companyName, $company['name']);
            
            if ($score > $highestScore && $score > 0.6) {
                $highestScore = $score;
                $bestMatch = [
                    'company_id' => $company['id'],
                    'company_name' => $company['name'],
                    'confidence' => $score,
                    'original_name' => $companyName
                ];
            }
        }
        
        return $bestMatch;
    }
    
    public static function findAllMatches($companyName) {
        $db = Database::getInstance();
        $companies = $db->fetchAll("SELECT * FROM companies WHERE status = 'active'");
        
        $matches = [];
        
        foreach ($companies as $company) {
            $score = self::calculateSimilarity($companyName, $company['name']);
            
            if ($score > 0.3) {
                $matches[] = [
                    'company_id' => $company['id'],
                    'company_name' => $company['name'],
                    'confidence' => $score,
                    'original_name' => $companyName
                ];
            }
        }
        
        // Sort by confidence score (descending)
        usort($matches, function($a, $b) {
            return $b['confidence'] <=> $a['confidence'];
        });
        
        return $matches;
    }
    
    private static function calculateSimilarity($str1, $str2) {
        // Normalize strings
        $str1 = strtolower(trim($str1));
        $str2 = strtolower(trim($str2));
        
        // Exact match
        if ($str1 === $str2) {
            return 1.0;
        }
        
        // Calculate Levenshtein distance
        $distance = levenshtein($str1, $str2);
        $maxLength = max(strlen($str1), strlen($str2));
        
        if ($maxLength === 0) {
            return 1.0;
        }
        
        $similarity = 1 - ($distance / $maxLength);
        
        // Bonus for partial matches
        if (strpos($str1, $str2) !== false || strpos($str2, $str1) !== false) {
            $similarity += 0.2;
        }
        
        // Bonus for word matches
        $words1 = explode(' ', $str1);
        $words2 = explode(' ', $str2);
        $commonWords = array_intersect($words1, $words2);
        
        if (!empty($commonWords)) {
            $wordBonus = count($commonWords) / max(count($words1), count($words2));
            $similarity += $wordBonus * 0.3;
        }
        
        return min(1.0, $similarity);
    }
}
