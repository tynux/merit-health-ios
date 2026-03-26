import SwiftUI

/**
 * 启动屏幕视图 - 展示和尚敲木鱼的禅意场景
 */
struct LaunchScreenView: View {
    @State private var isAnimating = false
    
    var body: some View {
        ZStack {
            // 背景渐变 - 薰衣草紫、腮红粉、淡薄荷绿
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.8, green: 0.7, blue: 0.9),  // 薰衣草紫
                    Color(red: 0.95, green: 0.8, blue: 0.85), // 腮红粉
                    Color(red: 0.85, green: 0.95, blue: 0.9)  // 淡薄荷绿
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 20) {
                Spacer()
                
                // 应用名称
                VStack(spacing: 10) {
                    Text("功德圆满")
                        .font(.system(size: 36, weight: .semibold, design: .default))
                        .foregroundColor(Color(red: 0.4, green: 0.3, blue: 0.6)) // 石板紫
                        .tracking(2) // 字距
                    
                    Text("通过健康修行 获得功德圆满")
                        .font(.system(size: 14, weight: .light, design: .default))
                        .foregroundColor(Color(red: 0.5, green: 0.4, blue: 0.7))
                        .tracking(1)
                }
                
                Spacer()
                
                // 加载指示器
                VStack(spacing: 20) {
                    // 脉冲动画圆圈
                    Circle()
                        .strokeBorder(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.8, green: 0.7, blue: 0.9),
                                    Color(red: 0.95, green: 0.8, blue: 0.85)
                                ]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 2
                        )
                        .frame(width: 50, height: 50)
                        .scaleEffect(isAnimating ? 1.2 : 1.0)
                        .opacity(isAnimating ? 0.3 : 1.0)
                        .animation(
                            Animation.easeInOut(duration: 1.5).repeatForever(autoreverses: true),
                            value: isAnimating
                        )
                    
                    Text("加载中...")
                        .font(.system(size: 12, weight: .light, design: .default))
                        .foregroundColor(Color(red: 0.5, green: 0.4, blue: 0.7))
                }
                
                Spacer()
                    .frame(height: 60)
            }
            .padding()
        }
        .onAppear {
            isAnimating = true
        }
    }
}

#Preview {
    LaunchScreenView()
}
