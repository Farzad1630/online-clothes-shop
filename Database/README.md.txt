# تنظیم روشنایی بر اساس حالت Dark / Light در ویندوز
# روشنایی بین 0 تا 100 درصد

# مسیر رجیستری برای حالت دارک / لایت
$themeKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"
$appTheme = Get-ItemPropertyValue -Path $themeKey -Name AppsUseLightTheme

# مقدار روشنایی که میخوای
$brightnessDark = 80   # وقتی Dark Mode هست
$brightnessLight = 50  # وقتی Light Mode هست

# تابع برای تغییر روشنایی
function Set-Brightness($brightness) {
    $monitors = Get-WmiObject -Namespace root/wmi -Class WmiMonitorBrightnessMethods
    foreach ($mon in $monitors) {
        $mon.WmiSetBrightness(1, $brightness) | Out-Null
    }
}

# شرط
if ($appTheme -eq 0) {
    # Dark Mode
    Set-Brightness $brightnessDark
    Write-Output "Dark Mode فعال شد → روشنایی روی $brightnessDark% تنظیم شد."
} else {
    # Light Mode
    Set-Brightness $brightnessLight
    Write-Output "Light Mode فعال شد → روشنایی روی $brightnessLight% تنظیم شد."
}
