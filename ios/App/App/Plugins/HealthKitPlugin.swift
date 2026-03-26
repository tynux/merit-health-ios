import Capacitor
import HealthKit

/**
 * HealthKit 插件 - 用于访问 iOS 健康应用的数据
 */
@objc(HealthKitPlugin)
public class HealthKitPlugin: CAPPlugin {
    private let healthStore = HKHealthStore()
    
    /**
     * 请求 HealthKit 权限
     */
    @objc func requestAuthorization(_ call: CAPPluginCall) {
        let typesToShare: Set<HKSampleType> = []
        
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
            HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
            HKObjectType.quantityType(forIdentifier: .distanceCycling)!,
            HKObjectType.quantityType(forIdentifier: .distanceSwimming)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.categoryType(forIdentifier: .appleStandTime)!,
        ]
        
        HKHealthStore().requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                if success {
                    call.resolve(["authorized": true])
                } else {
                    call.reject("Authorization failed", nil, error)
                }
            }
        }
    }
    
    /**
     * 获取今日步数
     */
    @objc func getTodaySteps(_ call: CAPPluginCall) {
        let stepType = HKObjectType.quantityType(forIdentifier: .stepCount)!
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
        
        let query = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to fetch steps", nil, error)
                    return
                }
                
                let steps = result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
                call.resolve(["steps": Int(steps)])
            }
        }
        
        healthStore.execute(query)
    }
    
    /**
     * 获取今日睡眠数据
     */
    @objc func getTodaySleep(_ call: CAPPluginCall) {
        let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
        
        let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to fetch sleep", nil, error)
                    return
                }
                
                var totalSleep: TimeInterval = 0
                if let samples = samples as? [HKCategorySample] {
                    for sample in samples {
                        totalSleep += sample.endDate.timeIntervalSince(sample.startDate)
                    }
                }
                
                let sleepHours = totalSleep / 3600
                call.resolve(["sleepHours": sleepHours])
            }
        }
        
        healthStore.execute(query)
    }
    
    /**
     * 获取今日活动能量消耗
     */
    @objc func getTodayEnergyBurned(_ call: CAPPluginCall) {
        let energyType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
        
        let query = HKStatisticsQuery(quantityType: energyType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to fetch energy", nil, error)
                    return
                }
                
                let energy = result?.sumQuantity()?.doubleValue(for: HKUnit.kilocalorie()) ?? 0
                call.resolve(["energyBurned": energy])
            }
        }
        
        healthStore.execute(query)
    }
    
    /**
     * 获取今日心率（平均和最高）
     */
    @objc func getTodayHeartRate(_ call: CAPPluginCall) {
        let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate)!
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
        
        let query = HKStatisticsQuery(quantityType: heartRateType, quantitySamplePredicate: predicate, options: [.discreteAverage, .discreteMax]) { _, result, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to fetch heart rate", nil, error)
                    return
                }
                
                let avgHeartRate = result?.averageQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0
                let maxHeartRate = result?.maximumQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0
                
                call.resolve([
                    "avgHeartRate": Int(avgHeartRate),
                    "maxHeartRate": Int(maxHeartRate)
                ])
            }
        }
        
        healthStore.execute(query)
    }
    
    /**
     * 获取距离数据（走路、跑步、自行车等）
     */
    @objc func getDistanceData(_ call: CAPPluginCall) {
        let activityType = call.getString("activityType") ?? "walking"
        
        var identifier: HKQuantityTypeIdentifier?
        switch activityType {
        case "cycling":
            identifier = .distanceCycling
        case "swimming":
            identifier = .distanceSwimming
        default:
            identifier = .distanceWalkingRunning
        }
        
        guard let distanceType = HKObjectType.quantityType(forIdentifier: identifier!) else {
            call.reject("Invalid activity type")
            return
        }
        
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
        
        let query = HKStatisticsQuery(quantityType: distanceType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to fetch distance", nil, error)
                    return
                }
                
                let distanceMeters = result?.sumQuantity()?.doubleValue(for: HKUnit.meter()) ?? 0
                call.resolve([
                    "distance": distanceMeters / 1000, // 转换为 km
                    "unit": "km"
                ])
            }
        }
        
        healthStore.execute(query)
    }
    
    /**
     * 获取站立时间
     */
    @objc func getStandingTime(_ call: CAPPluginCall) {
        let standType = HKObjectType.categoryType(forIdentifier: .appleStandTime)!
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
        
        let query = HKSampleQuery(sampleType: standType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to fetch standing time", nil, error)
                    return
                }
                
                let standingHours = samples?.count ?? 0 // 每个样本代表 1 小时
                call.resolve(["standingHours": standingHours])
            }
        }
        
        healthStore.execute(query)
    }
    
    /**
     * 获取所有今日健康数据（综合查询）
     */
    @objc func getAllTodayHealthData(_ call: CAPPluginCall) {
        var healthData: [String: Any] = [:]
        var completedQueries = 0
        let totalQueries = 7
        
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let formatter = ISO8601DateFormatter()
        healthData["date"] = formatter.string(from: startOfDay)
        
        // 获取步数
        if let stepsType = HKObjectType.quantityType(forIdentifier: .stepCount) {
            let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
            let query = HKStatisticsQuery(quantityType: stepsType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                healthData["steps"] = Int(result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0)
                completedQueries += 1
                if completedQueries == totalQueries {
                    call.resolve(healthData)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取睡眠
        if let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) {
            let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
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
                    call.resolve(healthData)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取心率
        if let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) {
            let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
            let query = HKStatisticsQuery(quantityType: heartRateType, quantitySamplePredicate: predicate, options: [.discreteAverage, .discreteMax]) { _, result, _ in
                healthData["avgHeartRate"] = Int(result?.averageQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0)
                healthData["maxHeartRate"] = Int(result?.maximumQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0)
                completedQueries += 1
                if completedQueries == totalQueries {
                    call.resolve(healthData)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取能量消耗
        if let energyType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) {
            let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
            let query = HKStatisticsQuery(quantityType: energyType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                healthData["energyBurned"] = result?.sumQuantity()?.doubleValue(for: HKUnit.kilocalorie()) ?? 0
                completedQueries += 1
                if completedQueries == totalQueries {
                    call.resolve(healthData)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取距离（走路+跑步）
        if let distanceType = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) {
            let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
            let query = HKStatisticsQuery(quantityType: distanceType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                let distanceMeters = result?.sumQuantity()?.doubleValue(for: HKUnit.meter()) ?? 0
                healthData["walkingDistance"] = distanceMeters / 1000
                completedQueries += 1
                if completedQueries == totalQueries {
                    call.resolve(healthData)
                }
            }
            healthStore.execute(query)
        }
        
        // 获取自行车距离
        if let cyclingType = HKObjectType.quantityType(forIdentifier: .distanceCycling) {
            let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now)
            let query = HKStatisticsQuery(quantityType: cyclingType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                let distanceMeters = result?.sumQuantity()?.doubleValue(for: HKUnit.meter()) ?? 0
                healthData["cyclingDistance"] = distanceMeters / 1000
                completedQueries += 1
                if completedQueries == totalQueries {
                    call.resolve(healthData)
                }
            }
            healthStore.execute(query)
        }
    }
}
