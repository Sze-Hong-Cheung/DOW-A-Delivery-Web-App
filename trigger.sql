SHOW TRIGGERS;

DELIMITER $$
CREATE TRIGGER ts_comment
    BEFORE UPDATE ON `comment`
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_commodity
    BEFORE UPDATE ON commodity
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_coupon
    BEFORE UPDATE ON coupon
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_credit_card
    BEFORE UPDATE ON credit_card
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_customer
    BEFORE UPDATE ON customer
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_customer_address
    BEFORE UPDATE ON credit_card
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_deliveryman
    BEFORE UPDATE ON deliveryman
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_employee
    BEFORE UPDATE ON deliveryman
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_employee_deliveryman
    BEFORE UPDATE ON employee_deliveryman
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_invoice
    BEFORE UPDATE ON invoice
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_order
    BEFORE UPDATE ON `order`
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_order_comm_transaction
    BEFORE UPDATE ON order_comm_transaction
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_outsourcing_company
    BEFORE UPDATE ON outsourcing_company
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_outsourcing_deliveryman
    BEFORE UPDATE ON outsourcing_deliveryman
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_payment
    BEFORE UPDATE ON payment
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_store
    BEFORE UPDATE ON store
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ts_store_deliveryman
    BEFORE UPDATE ON store_deliveryman
    FOR EACH ROW 
SET NEW.tbl_last_date = current_timestamp()
$$
DELIMITER ;