#!/usr/bin/env python3
"""
Test script for Spirit Animal API
Tests the /animal endpoint at localhost:5001
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
            image_data = image_file.read()
            base64_data = base64.b64encode(image_data).decode('utf-8')
            return base64_data
    except FileNotFoundError:
        print(f"❌ Error: Image file '{image_path}' not found")
        return None
    except Exception as e:
        print(f"❌ Error converting image: {e}")
        return None

def test_spirit_animal_api(image_path: str, api_url: str = "http://localhost:5001/animal"):
    """Test the spirit animal API"""
    
    print(f"🦁 Testing Spirit Animal API")
    print(f"📁 Image: {image_path}")
    print(f"🌐 API URL: {api_url}")
    print("-" * 50)
    
    if not os.path.exists(image_path):
        print(f"❌ Error: Image file '{image_path}' does not exist")
        return False
    
    print("📷 Converting image to base64...")
    base64_data = convert_image_to_base64(image_path)
    
    if not base64_data:
        return False
    
    print(f"✅ Image converted successfully (size: {len(base64_data)} chars)")
    
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {
        'image': base64_data
    }
    
    try:
        print("🚀 Sending request to API...")
        
        response = requests.post(
            api_url,
            headers=headers,
            json=payload, # Use json parameter for dict payload
            timeout=60  # Increased timeout for potentially slower AI model
        )
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                print("✅ API Response received successfully!")
                print(f"📋 Response: {json.dumps(result, indent=2)}")
                
                # Validate response format
                if isinstance(result, dict) and 'animal' in result and 'reason' in result:
                    print("\n✨ Your Spirit Animal:")
                    print(f"  - Animal: {result['animal']}")
                    print(f"  - Reason: {result['reason']}")
                else:
                    print(f"⚠️  Unexpected response format: {result}")
                
                return True
                
            except json.JSONDecodeError:
                print("❌ Error: Invalid JSON response")
                print(f"Raw response: {response.text}")
                return False
                
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Cannot connect to API. Is the server running on {api_url}?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Error: Request timed out (60s)")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: Request failed - {e}")
        return False

def main():
    """Main function to run the test"""
    
    print("🦁 Spirit Animal API Test Script")
    print("=" * 50)
    
    if len(sys.argv) < 2:
        print("Usage: python test_animal_api.py <image_path> [api_url]")
        print("\nExample:")
        print("  python test_animal_api.py photo.jpg")
        print("  python test_animal_api.py photo.jpg http://localhost:5001/animal")
        
        common_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        current_dir = Path('.')
        
        print("\n🔍 Looking for image files in current directory...")
        image_files = []
        for ext in common_extensions:
            image_files.extend(current_dir.glob(f'*{ext}'))
            image_files.extend(current_dir.glob(f'*{ext.upper()}'))
        
        if image_files:
            test_image = str(image_files[0])
            print(f"\n🎯 Using first found image: {test_image}")
            success = test_spirit_animal_api(test_image)
        else:
            print("No image files found. Please provide a path to an image.")
            return
    else:
        image_path = sys.argv[1]
        api_url = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:5001/animal"
        success = test_spirit_animal_api(image_path, api_url)
    
    print("-" * 50)
    if success:
        print("✅ Test completed successfully!")
    else:
        print("❌ Test failed!")

if __name__ == "__main__":
    main() 