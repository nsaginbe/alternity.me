#!/usr/bin/env python3
"""
Test script for Celebrity Lookalike API
Tests the /find endpoint at localhost:5000
"""

import base64
import requests
import json
import os
import sys
from pathlib import Path

def convert_image_to_base64(image_path: str) -> str:
    """Convert image file to base64 string without data URL prefix"""
    try:
        with open(image_path, 'rb') as image_file:
            # Read the binary data
            image_data = image_file.read()
            # Convert to base64
            base64_data = base64.b64encode(image_data).decode('utf-8')
            return base64_data
    except FileNotFoundError:
        print(f"❌ Error: Image file '{image_path}' not found")
        return None
    except Exception as e:
        print(f"❌ Error converting image: {e}")
        return None

def test_celebrity_api(image_path: str, api_url: str = "http://localhost:5000/find"):
    """Test the celebrity lookalike API"""
    
    print(f"🔍 Testing Celebrity Lookalike API")
    print(f"📁 Image: {image_path}")
    print(f"🌐 API URL: {api_url}")
    print("-" * 50)
    
    # Check if image file exists
    if not os.path.exists(image_path):
        print(f"❌ Error: Image file '{image_path}' does not exist")
        return False
    
    # Convert image to base64
    print("📷 Converting image to base64...")
    base64_data = convert_image_to_base64(image_path)
    
    if not base64_data:
        return False
    
    print(f"✅ Image converted successfully (size: {len(base64_data)} chars)")
    
    # Prepare request
    headers = {
        'Content-Type': 'image/jpeg'
    }
    
    try:
        print("🚀 Sending request to API...")
        
        # Send POST request
        response = requests.post(
            api_url,
            headers=headers,
            data=base64_data,
            timeout=30  # 30 second timeout
        )
        
        print(f"📊 Response Status: {response.status_code}")
        
        # Handle different response codes
        if response.status_code == 200:
            try:
                result = response.json()
                print("✅ API Response received successfully!")
                print(f"📋 Response: {json.dumps(result, indent=2)}")
                
                # Validate response format
                if isinstance(result, list):
                    if len(result) == 0:
                        print("⚠️  No celebrity matches found (empty response)")
                    else:
                        print(f"🎭 Found {len(result)} celebrity matches:")
                        for i, match in enumerate(result[:5], 1):  # Show top 5
                            if isinstance(match, dict) and 'name' in match and 'similarity' in match:
                                similarity_percent = round(match['similarity'] * 100, 1)
                                print(f"  {i}. {match['name']} - {similarity_percent}% similarity")
                            else:
                                print(f"  {i}. Invalid match format: {match}")
                else:
                    print(f"⚠️  Unexpected response format: {type(result)}")
                
                return True
                
            except json.JSONDecodeError:
                print("❌ Error: Invalid JSON response")
                print(f"Raw response: {response.text}")
                return False
                
        elif response.status_code == 400:
            print("❌ Error 400: Bad image data format")
            print(f"Response: {response.text}")
            return False
            
        elif response.status_code == 422:
            print("❌ Error 422: Image too large or invalid")
            print(f"Response: {response.text}")
            return False
            
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to API. Is the server running on localhost:5000?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Error: Request timed out (30s)")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: Request failed - {e}")
        return False

def main():
    """Main function to run the test"""
    
    print("🎭 Celebrity Lookalike API Test Script")
    print("=" * 50)
    
    # Check command line arguments
    if len(sys.argv) < 2:
        print("Usage: python test_api.py <image_path> [api_url]")
        print("\nExample:")
        print("  python test_api.py photo.jpg")
        print("  python test_api.py photo.jpg http://localhost:5000/find")
        
        # Try to find common image files in current directory
        common_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        current_dir = Path('.')
        
        print("\n🔍 Looking for image files in current directory...")
        image_files = []
        for ext in common_extensions:
            image_files.extend(current_dir.glob(f'*{ext}'))
            image_files.extend(current_dir.glob(f'*{ext.upper()}'))
        
        if image_files:
            print("Found image files:")
            for img in image_files[:5]:  # Show first 5
                print(f"  - {img.name}")
            
            # Use first found image
            test_image = str(image_files[0])
            print(f"\n🎯 Using: {test_image}")
            success = test_celebrity_api(test_image)
        else:
            print("No image files found in current directory.")
            return
    else:
        # Use provided image path
        image_path = sys.argv[1]
        api_url = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:5000/find"
        
        success = test_celebrity_api(image_path, api_url)
    
    print("-" * 50)
    if success:
        print("✅ Test completed successfully!")
    else:
        print("❌ Test failed!")

if __name__ == "__main__":
    main() 