### Site Reliability Engineering (SRE)

- Originated at Google with Benjamin Treynor Sloss in **2003**
  - famous quote from this man: "Hope is not a strategy"

- The definition of expected reliability is defined by the company (sometimes good enough is good enough)
- An SRE should not be spending all of their time fighting fires
- it is possible to implement principles of SRE at work without becoming an SRE

#### Types of SRE teams

1. Kitchen Sink
   - unbounded scope of services/workflows
   - tends to be the first implementation of a team
   - often grows organically
   - Pros
     - no gaps between teams (everything in one place)
     - easier to spot patterns
     - helps to glue together separate dev teams
   - Cons
     - can overload the team
     - no SRE team charter
     - more shallow impact as a company expands
     - harder to involve the team
   - Best for a smaller company (few applications), but still need a dedicated SRE team
2. Infrastructure
   - focus on the efforts that help make other teams' jobs faster and easier
     - use Kubernetes often, or other tools common in DevOps
   - Pros
     - Allows devs to use DevOps practices with consistency across the business
     - can focus on providing a reliable infrastructure
   - Cons
     - can be hard to involve the team if implemented poorly
     - lack of contact with customers can lead to a lack of focus on the customer experience
     - may have to split teams
   - Best for a company with several development teams; often can be also split between an actual DevOps team to focus on infrastructure and an SRE team to focus on reliability
3. Tools
   - focus on building software to help developers measure, maintain, and improve system reliability
     - different from infrastructure because they focus on reliability and less on shared back ends and serving
     - Pros and cons similar to infrastructure team
   - Cons:
     - make sure the tools team doesn't turn into an infrastructure team (and vice versa)
     - high risk of toil and overload
       - establish a team charter!!
4. Product/application
   - works to improve reliability of a critical application or business area
   - Pros
     - provides clear focus for teams efforts and a clear link
   - Cons
     - as complexity grows, there is a risk of duplication and divergence of practices between product/application teams
   - Best for a second/nth team if a company started with a Kitchen Sink/infrastructure/tools team but now the high reliability of a user application demands expansion of dedicated SREs
5. Embedded
   - SREs are embedded within developer teams
   - Pros
     - Enables focused expertize for a team
     - side-by-side demo of SRE practices (devs learn to get good!)
   - Cons
     - lack of standardization/divergence in practice
     - may not have as much SRE peer mentorship
   - Best for starting an SRE function or to scale further 
6. Consulting
   - similar to embedded BUT avoid changing customer code and config of services
   - Pros
     - help further scaling of existing SRE's impact
     - decouples
   - Cons
     - consultants could lack sufficient context to be heloful
     - can be perceived as hands-off
   - Best for pre making a dedicated SRE team

#### SRE vs DevOps

- developed in parallel
  - NOT the same
- they are both different answers to similar issues
- SRE can be a person, DevOps cannot be a person
- SREs hate toil !!! 
  - automation automation automation

#### Virtuous cycle 1: Service Level Indicator (SLI) and Service Level Objective (SLO)

- SLI = How do you know the service is up and working well?
  - Some measures could be:
    - success vs. failure measures
    - measures of timing
    - measures of throughput
  - &uarr; we did all of these metrics in class which is pretty cool
- SLO =  the decision of how reliable the service should be
  - must be accurately measured and represented in the monitoring system
  - this is more like a threshold of what is good, versus with SLI those are more like the metrics themselves

- organizations will often use the SLI and SLO to make an error budget, this kind of plays into the idea that good enough is good enough (which is a reality of this fallen world I tend to *hate* tee hee)
  - organizations will also set the expected behavior when you exhaust the error budget for a given service (and will need to choose what they do if they exceed it as well)

#### Virtuous cycle 2: blameless postmortems

- postmortems **must** be blameless in SRE
  - focus on tech and process instead of the individuals
    - "What guardrails should have been in place so that it wasn't possible to have such a catastrophic failure?"
  - firing people if your system fails won't really solve the issue (in MOST cases)

