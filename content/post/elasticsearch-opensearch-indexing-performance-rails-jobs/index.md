---
title: "Unlocking Performance with AsyncJob: Specific Use Cases for I/O-Bound Operations"
date: 2025-07-20T12:26:17+05:30
tags: ['Elasticsearch', 'OpenSearch', 'Rails', 'Job Processing', 'Performance', 'Development']
description: "Discover how I achieved 5x faster Elasticsearch operations in Rails by switching to AsyncJob. The benchmarks show dramatic performance improvements with 30% less memory usage."
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "async-vs-thread.png"
    relative: true
    alt: "AsyncJob vs Thread"
---
## The Elasticsearch Scaling Nightmare

Picture this: Your Rails application is humming along nicely until suddenly, user growth explodes. Great news, right? Not for our job queue.

In a previous application I worked on, we faced significant challenges scaling ActiveJobs, primarily due to numerous Elasticsearch indexing and other I/O-bound tasks. As our user base grew, thousands of small jobs overwhelmed our queue, creating a perfect storm of bottlenecks despite our best efforts at dynamic worker scaling.

We tried all the usual solutions:
- Increased worker counts (which quickly hit diminishing returns)
- Added more powerful servers (hello, spiraling AWS bills)
- Optimized database connections (still not enough)
- Tweaked job priorities and batching strategies (marginal improvements at best)

Yet we still hit hard limits with database connections, memory consumption, and infrastructure costs. The fundamental issue wasn't our implementation,it was the thread-based job processing paradigm itself, which simply wasn't optimized for our I/O-heavy workload.

## Why AsyncJob for I/O-Bound Operations?

Enter [AsyncJob](https://github.com/socketry/async-job), a gem that fundamentally reimagines how Ruby handles concurrent operations by leveraging **Ruby fibers** for cooperative multitasking.

### The Thread vs. Fiber Difference

To understand why this matters, let's break down what happens during an Elasticsearch indexing operation:

**With traditional thread-based job processors (like SolidQueue):**
1. A thread makes an HTTP request to Elasticsearch
2. The thread blocks while waiting for a response
3. The OS must context-switch to another thread
4. Each thread requires its own memory stack (often 1MB+ per thread)
5. Thread context switching has significant overhead

**With fiber-based AsyncJob:**
1. A fiber makes an HTTP request to Elasticsearch
2. The fiber voluntarily yields control while waiting
3. Another fiber can immediately use the same thread
4. Fibers are lightweight (a few KB each)
5. Switching between fibers is extremely efficient

This approach is exceptionally efficient for operations that spend most of their time waiting for external resources (I/O-bound), because instead of wasting CPU cycles waiting for responses, the system can process other jobs in the meantime.

## Getting Started with AsyncJob

Integrating AsyncJob into your Rails application is surprisingly straightforward. The gem provides an adapter for ActiveJob, allowing you to selectively apply it to jobs that would benefit most from fiber-based processing.

### Installation

Add these gems to your Gemfile:

```ruby
gem 'async-job'
gem 'async-job-adapter-active_job'
gem 'async-job-processor-redis'
```

Then run:

```bash
bundle install
```

### Configuration

For jobs that would benefit from fiber-based processing, simply specify AsyncJob as the queue adapter:

```ruby
class SearchIndexingJob < ApplicationJob
  self.queue_adapter = :async_job  # This job uses fibers
  queue_as :default
  
  def perform(document)
    # Your I/O-heavy code here
  end
end
```

You can continue using your existing queue adapter for other jobs:

```ruby
class CPUIntensiveJob < ApplicationJob
  # This job still uses your default queue adapter
  queue_as :default
  
  def perform(data)
    # CPU-intensive operations
  end
end
```

For more detailed setup instructions, check out the [AsyncJob Active Job Adapter documentation](https://socketry.github.io/async-job-adapter-active_job/guides/getting-started/index).

## Benchmarking AsyncJob vs. SolidQueue for OpenSearch Operations

To validate my hypothesis about AsyncJob's benefits for I/O-bound operations, I created a comprehensive benchmarking project comparing AsyncJob (fiber-based) with SolidQueue (thread-based) for OpenSearch indexing operations.

### The Experiment Setup

I created two nearly identical jobs:
- `JobTest1Job` - Using SolidQueue with synchronous HTTP calls
- `JobTest2Job` - Using AsyncJob with asynchronous HTTP calls

Both jobs perform the same task: indexing documents in OpenSearch. To simulate real-world conditions with network latency, I added a 3-second artificial delay to each OpenSearch request.

The full code and detailed results are available in my [GitHub repository](https://github.com/vikas-0/jobtest).

```bash
========== BENCHMARK RESULTS ==========

----- Batch Size: 10 documents -----
SolidQueue (JobTest1Job):
  Avg Enqueue Time: 0.18s
  Avg Total Time: 1.19s
  Avg Throughput: 8.45 docs/second

AsyncJob (JobTest2Job):
  Avg Enqueue Time: 0.06s
  Avg Total Time: 1.06s
  Avg Throughput: 9.39 docs/second

Result: AsyncJob was 11.6% faster for 10 documents

----- Batch Size: 100 documents -----
SolidQueue (JobTest1Job):
  Avg Enqueue Time: 0.59s
  Avg Total Time: 1.6s
  Avg Throughput: 62.96 docs/second

AsyncJob (JobTest2Job):
  Avg Enqueue Time: 0.24s
  Avg Total Time: 1.25s
  Avg Throughput: 80.12 docs/second

Result: AsyncJob was 27.4% faster for 100 documents

----- Batch Size: 1000 documents -----
SolidQueue (JobTest1Job):
  Avg Enqueue Time: 4.8s
  Avg Total Time: 19.17s
  Avg Throughput: 54.78 docs/second

AsyncJob (JobTest2Job):
  Avg Enqueue Time: 2.25s
  Avg Total Time: 3.25s
  Avg Throughput: 307.48 docs/second

Result: AsyncJob was 489.1% faster for 1000 documents

========================================

========== RESOURCE USAGE METRICS ==========

----- SOLID_QUEUE Resource Usage -----
Memory Usage:
  Average: 128.69 MB
  Maximum: 177.19 MB
CPU Usage:
  Average per job: 28.4549 seconds
  Total CPU time: 74295.6439 seconds

----- ASYNC_JOB Resource Usage -----
Memory Usage:
  Average: 89.42 MB
  Maximum: 118.83 MB
CPU Usage:
  Average per job: 3.128 seconds
  Total CPU time: 5864.9192 seconds

----- Comparison -----
Memory Usage: AsyncJob uses -30.51% less memory than SolidQueue
CPU Usage: AsyncJob uses -92.11% less CPU time than SolidQueue
```
Note: For solid queue, I have used 1 worker with 3 threads, which is a default configuration for solid queue.

## Analyzing the Results

### Performance Scaling with Batch Size

The most striking finding from the benchmarks is how AsyncJob's advantage scales with batch size:

| Batch Size | Performance Advantage |
|------------|------------------------|
| 10 documents | AsyncJob was 11.6% faster |
| 100 documents | AsyncJob was 27.4% faster |
| 1000 documents | AsyncJob was 489.1% faster |

**Key Insight:** AsyncJob's performance advantage dramatically increases with the number of I/O operations. For small workloads, the difference is noticeable but modest. For large workloads, the difference is transformative.

### Resource Efficiency

Beyond raw speed, the resource efficiency gains are equally impressive:

- **Memory Usage:** AsyncJob uses 30.5% less memory than SolidQueue (89.42 MB vs 128.69 MB)
- **CPU Usage:** AsyncJob uses 92.1% less CPU time than SolidQueue (5,865 seconds vs 74,296 seconds)

This translates to significant infrastructure cost savings at scale.

## The Secret Sauce: Async HTTP Client

A key part of my implementation was creating a fiber-aware HTTP client for OpenSearch. Here's a simplified version:

```ruby
class AsyncOpenSearchClient
  def index(index:, id: nil, body:)
    # Return an Async task that performs the request asynchronously
    Async do |task|  
      # Make the request asynchronously
      response = Async::HTTP::Internet.post(url, headers, json_body)
      
      # Process response...
    end
  end
end
```

This client ensures that while waiting for HTTP responses, other fibers can continue processing, maximizing throughput.

## When to Use AsyncJob

Based on my benchmarks and some research (Google and AI), AsyncJob is ideal for:

### 1. Search Engine Indexing

This was our primary pain point. AsyncJob transforms Elasticsearch/OpenSearch indexing by efficiently switching fibers during network I/O waits, allowing concurrent indexing operations.

```ruby
class SearchIndexingJob < ApplicationJob
  self.queue_adapter = :async_job
  queue_as :default

  def perform(document)
    # Each index operation is an I/O operation where AsyncJob can yield
    search_client.index(
      index: "content",
      id: document.id,
      body: document.to_indexed_json
    )
  end
end
```

### 2. API Integrations

Jobs that make external API calls are perfect candidates for AsyncJob:

```ruby
class NotificationJob < ApplicationJob
  self.queue_adapter = :async_job
  queue_as :default

  def perform(user_id, message)
    # Multiple API calls can run concurrently
    push_notification_service.send(user_id, message)
    slack_service.notify(message)
    analytics_service.track("notification_sent", user_id)
  end
end
```

### 3. LLM Operations

Large Language Model API calls typically have high latency, making them ideal for AsyncJob:

```ruby
class AIProcessingJob < ApplicationJob
  self.queue_adapter = :async_job
  queue_as :default

  def perform(documents)
    # Process multiple documents concurrently
    documents.each do |doc|
      summary = llm_client.summarize(doc.content)
      doc.update(ai_summary: summary)
    end
  end
end
```

## When NOT to Use AsyncJob

1. **CPU-Intensive Operations**: If your job is CPU-bound (complex calculations, image processing), traditional thread-based queues may perform better.

2. **Very Short-Running Jobs**: For jobs that complete in milliseconds with minimal I/O, the overhead of fiber management might not be worth it.

3. **Jobs with Non-Fiber-Aware Dependencies**: Some gems and libraries aren't fiber-aware and may block fibers, negating AsyncJob's benefits.

4. **Jobs Requiring Robust Error Handling**: AsyncJob currently lacks some of the error handling capabilities found in more mature job processors.

## Important Considerations: Error Handling with AsyncJob

While AsyncJob offers impressive performance benefits, it's important to be aware of its current limitations in error handling:
1. Limited Built-in Error Handling
2. Manual Error Logging Required
3. Monitoring Challenges

## Conclusion: A Game-Changer for I/O-Heavy Workloads

For applications with significant I/O-bound job processing needs, AsyncJob represents a paradigm shift in performance and efficiency. My benchmarks show that it's not just marginally better—it can be 5x faster while using 30% less memory and 90% less CPU time.

The best part? You can gradually adopt AsyncJob for specific jobs without changing your entire infrastructure. Start by identifying your most I/O-intensive jobs and convert them first to see immediate benefits.

If your Rails application is struggling with I/O-bound job processing, AsyncJob might just be the solution you've been looking for.

(Note: I have not used it extensively in production yet, but the benchmarks show promising results.)
