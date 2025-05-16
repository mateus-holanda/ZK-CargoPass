// Circuit to verify if the issue date is valid
fn main(issue_date: Field, current_date: pub Field, max_days_diff: pub Field) {
    // Issue date must be in the past
    let is_issue_date_in_past: bool = issue_date <= current_date;

    // Issue date must not be older than a certain number of days
    let days_diff: u16 = (current_date - issue_date) as u16;
    let is_issue_date_recent: bool = days_diff <= max_days_diff;

    let is_issue_date_valid: bool = is_issue_date_in_past && is_issue_date_recent;

    assert(is_issue_date_valid);
}

#[test]
fn test_main() {
    // Current date (ex: day 20225 since 1970-01-01 => 2025-05-17)
    let current_date = 20225;
    // Max number of days allowed since first issue (1 year = 365 days)
    let max_days_diff = 365;
    // Test with a valid date (100 days ago)
    let valid_date = current_date - 100;

    main(valid_date, current_date, max_days_diff);
}


#[test]
fn test_main_limit_date() {
    // Current date (ex: day 20225 since 1970-01-01 => 2025-05-17)
    let current_date = 20225;
    // Max number of days allowed since first issue (1 year = 365 days)
    let max_days_diff = 365;
    // Test with a date in the limit range (exactly 365 days ago)
    let limit_date = current_date - 365;

    main(limit_date, current_date, max_days_diff);
}

#[test(should_fail)]
fn test_main_future_date() {
    // Current date (ex: day 20225 since 1970-01-01 => 2025-05-17)
    let current_date = 20225;
    // Max number of days allowed since first issue (1 year = 365 days)
    let max_days_diff = 365;
    // Test with a date in the future (100 days ahead)
    let future_date = current_date + 100;

    main(future_date, current_date, max_days_diff);
}

#[test(should_fail)]
fn test_main_old_date() {
    // Current date (ex: day 20225 since 1970-01-01 => 2025-05-17)
    let current_date = 20225;
    // Max number of days allowed since first issue (1 year = 365 days)
    let max_days_diff = 365;
    // Test with a date too old (1000 days ago)
    let old_date = current_date - 1000;

    main(old_date, current_date, max_days_diff);
}