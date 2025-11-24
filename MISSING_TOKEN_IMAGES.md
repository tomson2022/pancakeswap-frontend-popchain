# 缺失的代币图片文件

## 检查结果

所有 404 错误的图片文件都**不存在**于文件系统中。

## 缺失的文件列表（18个）

所有文件都应该使用 **checksum 格式**命名，保存到 `apps/web/public/images/tokens/` 目录：

1. `0xA283AFb2c295b493412fB27b30Ad531D2c58fD75.png`
2. `0x50C384FA8a8684e0883a9e446B5af091EfF91635.png`
3. `0xe086c547211Aa361E9335c3E802d32007e9410E8.png`
4. `0x5C64E6B2348fD0A2F992FA2FF4A82c3285B498Ac.png`
5. `0x29811c3b87967F24852456FC0c41423974b86677.png`
6. `0xc45659EC6A579aa587638114059ac2905009B45b.png`
7. `0xD04026053C9191E97C6892d193cCBA34671C7E57.png`
8. `0x32DB6F80C74d05927e3D3abc61a4a2CcfCe34d52.png`
9. `0xb54bfc2d006dc8789dCfBE941e68172fb79c905a.png`
10. `0x0943F5E5114Adc6e9ecBA67360d4632E4d28263f.png`
11. `0x5423B00B08C1F0978EB85263168B54ab2e422361.png`
12. `0x87CC783889dc498D3FAD0C4C86De57716Ff2BE2E.png`
13. `0x5d3D3633A9B6926C47207844cc4CfAa1Ec21488f.png`
14. `0xeC6892aAd4690B75Df87D7528e9Fc05a48e8c9f2.png`
15. `0x3E6BD097632851C4119F63334A435cCB692df50B.png`
16. `0x77399e398238A7e723F4AD5846b622722EefdF23.png`
17. `0x385E05AE8153bA7f8B5A4066F2F54B434E255d5A.png`
18. `0x235b623D9264d260626De1C21748A652Ea474449.png`

## 检查结果

✅ **文件命名格式正确**：所有请求的地址都是正确的 checksum 格式  
✅ **代码逻辑正确**：`getTokenLogoURL` 会正确转换地址为 checksum 格式  
❌ **文件缺失**：这些代币的图片文件不存在于文件系统中

## 解决方案

### 方法 1：手动下载

1. 获取每个代币的图片 URL
2. 下载图片文件
3. 使用 checksum 格式的地址命名文件
4. 保存到 `apps/web/public/images/tokens/` 目录

### 方法 2：使用脚本批量下载

可以创建一个脚本，从代币列表或 API 获取图片 URL，然后批量下载。

### 注意事项

- 文件必须使用 **checksum 格式**的地址命名（不是小写）
- 文件扩展名可以是 `.png` 或 `.svg`
- 文件大小建议不超过 200KB
- 图片尺寸建议 256x256 或 512x512 像素

## 验证

下载完成后，可以通过以下命令验证：

```bash
# 检查文件是否存在
for addr in "0xA283AFb2c295b493412fB27b30Ad531D2c58fD75" "0xe086c547211Aa361E9335c3E802d32007e9410E8"; do
  if [ -f "apps/web/public/images/tokens/${addr}.png" ]; then
    echo "✅ ${addr}.png 存在"
  else
    echo "❌ ${addr}.png 缺失"
  fi
done
```

## 更新日期

2024-11-08

