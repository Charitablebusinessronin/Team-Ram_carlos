/**
 * Session Start Hook - Logs agent session initialization to Allura Memory
 * 
 * This hook is called when an agent session starts.
 * It logs the session initialization to Allura for audit trail.
 */

import { memory_add } from 'mcp:allura-memory';

export interface SessionStartParams {
  agentId: string;
  task: string;
  group_id?: string;
}

/**
 * Called when an agent session starts
 * Logs session initialization to Allura Memory
 */
export async function onSessionStart(params: SessionStartParams): Promise<void> {
  const { agentId, task, group_id = 'allura-system' } = params;
  
  try {
    await memory_add({
      group_id: group_id,
      user_id: agentId,
      content: `Session started: ${task}`,
      metadata: {
        source: 'agent-hook',
        event_type: 'SESSION_START',
        agent_id: agentId,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`[Session Hook] Logged session start for ${agentId}: ${task}`);
  } catch (error) {
    console.error('[Session Hook] Failed to log session start:', error);
    // Don't throw - session should continue even if logging fails
  }
}

/**
 * Scout pre-task query - Retrieves context from Allura before task execution
 */
export async function scoutPreTaskQuery(agentId: string, task: string): Promise<any[]> {
  try {
    const results = await memory_search({
      group_id: 'allura-system',
      query: task,
      limit: 5
    });
    
    console.log(`[Scout Hook] Retrieved ${results.length} memories for task: ${task}`);
    return results;
  } catch (error) {
    console.error('[Scout Hook] Failed to query memories:', error);
    return [];
  }
}