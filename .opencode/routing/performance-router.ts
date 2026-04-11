/**
 * Performance Router - Routes tasks based on agent performance history from Allura
 * 
 * This router queries Allura Memory for agent performance metrics
 * and selects the best agent for the task type.
 */

import { memory_search } from 'mcp:allura-memory';

interface AgentPerformance {
  agentId: string;
  successRate: number;
  avgDuration: number;
  taskCount: number;
}

/**
 * Select the best agent for a task type based on performance history
 */
export async function selectAgent(taskType: string): Promise<string> {
  try {
    // Query Allura for agent performance
    const results = await memory_search({
      group_id: 'allura-system',
      query: `agent performance ${taskType}`,
      limit: 10
    });
    
    // Analyze success rates
    const agentScores = analyzePerformance(results);
    
    // Select best agent
    const bestAgent = selectBestAgent(agentScores);
    
    console.log(`[Router] Selected ${bestAgent} for ${taskType} (score: ${agentScores[bestAgent]?.successRate || 0})`);
    return bestAgent;
  } catch (error) {
    console.error('[Router] Failed to query performance history:', error);
    // Fallback to default routing
    return getDefaultAgent(taskType);
  }
}

/**
 * Analyze performance results from Allura
 */
function analyzePerformance(memories: any[]): Record<string, AgentPerformance> {
  const agentStats: Record<string, AgentPerformance> = {};
  
  for (const memory of memories) {
    const agentId = memory.metadata?.agent_id;
    if (!agentId) continue;
    
    if (!agentStats[agentId]) {
      agentStats[agentId] = {
        agentId,
        successRate: 0,
        avgDuration: 0,
        taskCount: 0
      };
    }
    
    const stats = agentStats[agentId];
    stats.taskCount++;
    
    // Calculate success rate from metadata
    if (memory.metadata?.event_type === 'TASK_COMPLETE') {
      const confidence = memory.metadata?.confidence || 0.5;
      stats.successRate = (stats.successRate * (stats.taskCount - 1) + confidence) / stats.taskCount;
    }
  }
  
  return agentStats;
}

/**
 * Select the best agent from performance scores
 */
function selectBestAgent(agentScores: Record<string, AgentPerformance>): string {
  const agents = Object.values(agentScores);
  
  if (agents.length === 0) {
    return 'openagent';  // Default fallback
  }
  
  // Sort by success rate (descending)
  agents.sort((a, b) => b.successRate - a.successRate);
  
  return agents[0].agentId;
}

/**
 * Default agent routing table (fallback when Allura is unavailable)
 */
function getDefaultAgent(taskType: string): string {
  const routingTable: Record<string, string> = {
    'discovery': 'scout-recon',
    'intent': 'jobs-intent-gate',
    'architecture': 'brooks-architect',
    'implementation': 'woz-builder',
    'refactor': 'pike-refactorer',
    'performance': 'fowler-performance',
    'validation': 'bellard-validator'
  };
  
  return routingTable[taskType] || 'openagent';
}