import Foundation
import BackgroundTasks
import HealthKit

/**
 * iOS 后台同步任务 - 定期同步 HealthKit 数据到服务器
 */

class BackgroundSyncManager {
    static let shared = BackgroundSyncManager()
    
    private let taskIdentifier = "com.meritgame.healthkit.sync"
    private let healthStore = HKHealthStore()
    
    /**
     * 注册后台同步任务
     */
    func registerBackgroundTask() {
        // 注册后台处理任务
        BGTaskScheduler.shared.register(forTaskWithIdentifier: taskIdentifier, using: nil) { task in
            self.handleBackgroundSync(task: task as! BGProcessingTask)
        }
    }
    
    /**
     * 安排后台同步任务
     */
    func scheduleBackgroundSync() {
        let request = BGProcessingTaskRequest(identifier: taskIdentifier)
        request.requiresNetworkConnectivity = true
        request.requiresExternalPower = false
        
        do {
            try BGTaskScheduler.shared.submit(request)
            print("[Background Sync] Task scheduled successfully")
        } catch {
            print("[Background Sync] Failed to schedule task: \(error)")
        }
    }
    
    /**
     * 处理后台同步任务
     */
    private func handleBackgroundSync(task: BGProcessingTask) {
        // 安排下一次同步任务
        scheduleBackgroundSync()
        
        // 执行同步操作
        syncHealthKitData { success in
            if success {
                task.setTaskCompleted(success: true)
                print("[Background Sync] Sync completed successfully")
            } else {
                task.setTaskCompleted(success: false)
                print("[Background Sync] Sync failed")
            }
        }
        
        // 设置任务过期处理
        task.expirationHandler = {
            print("[Background Sync] Task expired")
            task.setTaskCompleted(success: false)
        }
    }
    
    /**
     * 同步 HealthKit 数据
     */
    private func syncHealthKitData(completion: @escaping (Bool) -> Void) {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let tomorrow = calendar.date(byAdding: .day, value: 1, to: today)!
        
        let predicate = HKQuery.predicateForSamples(withStart: today, end: tomorrow)
        
        // 并行获取所有健康数据
        var healthData: [String: Any] = [:]
        var completedQueries = 0
        let totalQueries = 7
        
        let dateFormatter = ISO8601DateFormatter()
        healthData["date"] = dateFormatter.string(from: today)
        
        // 获取步数
        if let stepsType = HKObjectType.quantityType(forIdentifier: .stepCount) {
            let query = HKStatisticsQuery(quantityType: stepsType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                healthData["steps"] = Int(result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0)
                completedQueries += 1
                if completedQueries == totalQueries {
                    self.uploadHealthData(healthData, completion: completion)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取睡眠
        if let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) {
            let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
                var totalSleep: TimeInterval = 0
                if let samples = samples as? [HKCategorySample] {
                    for sample in samples {
                        totalSleep += sample.endDate.timeIntervalSince(sample.startDate)
                    }
                }
                healthData["sleepHours"] = totalSleep / 3600
                completedQueries += 1
                if completedQueries == totalQueries {
                    self.uploadHealthData(healthData, completion: completion)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取心率
        if let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) {
            let query = HKStatisticsQuery(quantityType: heartRateType, quantitySamplePredicate: predicate, options: [.discreteAverage, .discreteMax]) { _, result, _ in
                healthData["avgHeartRate"] = Int(result?.averageQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0)
                healthData["maxHeartRate"] = Int(result?.maximumQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0)
                completedQueries += 1
                if completedQueries == totalQueries {
                    self.uploadHealthData(healthData, completion: completion)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取能量消耗
        if let energyType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) {
            let query = HKStatisticsQuery(quantityType: energyType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                healthData["energyBurned"] = result?.sumQuantity()?.doubleValue(for: HKUnit.kilocalorie()) ?? 0
                completedQueries += 1
                if completedQueries == totalQueries {
                    self.uploadHealthData(healthData, completion: completion)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取距离（走路+跑步）
        if let distanceType = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) {
            let query = HKStatisticsQuery(quantityType: distanceType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                let distanceMeters = result?.sumQuantity()?.doubleValue(for: HKUnit.meter()) ?? 0
                healthData["walkingDistance"] = distanceMeters / 1000
                completedQueries += 1
                if completedQueries == totalQueries {
                    self.uploadHealthData(healthData, completion: completion)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取自行车距离
        if let cyclingType = HKObjectType.quantityType(forIdentifier: .distanceCycling) {
            let query = HKStatisticsQuery(quantityType: cyclingType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                let distanceMeters = result?.sumQuantity()?.doubleValue(for: HKUnit.meter()) ?? 0
                healthData["cyclingDistance"] = distanceMeters / 1000
                completedQueries += 1
                if completedQueries == totalQueries {
                    self.uploadHealthData(healthData, completion: completion)
                }
            }
            healthStore.execute(query)
        }
    }
    
    /**
     * 上传健康数据到服务器
     */
    private func uploadHealthData(_ data: [String: Any], completion: @escaping (Bool) -> Void) {
        // TODO: 调用 Capacitor 插件上传数据到服务器
        // 这里应该调用 tRPC API: health.syncHealthKitData
        
        print("[Background Sync] Uploading health data: \(data)")
        completion(true)
    }
}
