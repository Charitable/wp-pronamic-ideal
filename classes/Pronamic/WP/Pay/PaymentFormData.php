<?php

/**
 * Title: WordPress payment test data
 * Description:
 * Copyright: Copyright (c) 2005 - 2015
 * Company: Pronamic
 * @author Remco Tolsma
 * @version 3.7.0
 * @since 3.7.0
 */
class Pronamic_WP_Pay_PaymentFormData extends Pronamic_WP_Pay_PaymentData {
	/**
	 * Amount
	 *
	 * @var float
	 */
	private $amount;

	//////////////////////////////////////////////////

	/**
	 * Get source indicator
	 *
	 * @see Pronamic_Pay_PaymentDataInterface::get_source()
	 * @return string
	 */
	public function get_source() {
		return 'payment_form';
	}

	public function get_source_id() {
		return filter_input( INPUT_POST, 'pronamic_pay_form_id', FILTER_VALIDATE_INT );
	}

	//////////////////////////////////////////////////

	/**
	 * Get description
	 *
	 * @see Pronamic_Pay_PaymentDataInterface::get_description()
	 * @return string
	 */
	public function get_description() {
		return sprintf( __( 'Payment Form %s', 'pronamic_ideal' ), $this->get_order_id() );
	}

	/**
	 * Get order ID
	 *
	 * @see Pronamic_Pay_PaymentDataInterface::get_order_id()
	 * @return string
	 */
	public function get_order_id() {
		return time();
	}

	/**
	 * Get items
	 *
	 * @see Pronamic_Pay_PaymentDataInterface::get_items()
	 * @return Pronamic_IDeal_Items
	 */
	public function get_items() {
		// Items
		$items = new Pronamic_IDeal_Items();

		// Amount
		$amount = filter_input( INPUT_POST, 'pronamic_pay_amount', FILTER_SANITIZE_STRING, array (
			'flags'   => FILTER_FLAG_ALLOW_THOUSAND,
			'options' => array( 'decimal' => pronamic_pay_get_decimal_separator() ),
		) );

		// Get correct amount if pronamic_pay_amount is an array
		if ( ! $amount && $amount = filter_input( INPUT_POST, 'pronamic_pay_amount', FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY ) ) {
			// Array filter will remove values NULL, FALSE and empty strings ('')
			$amount = array_filter( $amount );

			// Make sure the amount has the correct floating value
			foreach( $amount as $key => $value ) {
				if ( 'other' !== $key ) {
					$amount[$key] = $value / 100;
				}
			}

			// Get first element of the array
			$amount = array_shift( $amount );
		}

		$amount = Pronamic_WP_Pay_Util::string_to_amount( $amount );

		// Item
		$item = new Pronamic_IDeal_Item();
		$item->setNumber( $this->get_order_id() );
		$item->setDescription( sprintf( __( 'Payment %s', 'pronamic_ideal' ), $this->get_order_id() ) );
		$item->setPrice( $amount );
		$item->setQuantity( 1 );

		$items->addItem( $item );

		return $items;
	}

	//////////////////////////////////////////////////
	// Currency
	//////////////////////////////////////////////////

	/**
	 * Get currency alphabetic code
	 *
	 * @see Pronamic_Pay_PaymentDataInterface::get_currency_alphabetic_code()
	 * @return string
	 */
	public function get_currency_alphabetic_code() {
		return 'EUR';
	}

	//////////////////////////////////////////////////
	// Customer
	//////////////////////////////////////////////////

	public function get_email() {
		return filter_input( INPUT_POST, 'pronamic_pay_email', FILTER_VALIDATE_EMAIL );
	}

	public function getCustomerName() {
		$first_name = filter_input( INPUT_POST, 'pronamic_pay_first_name', FILTER_VALIDATE_EMAIL );
		$last_name  = filter_input( INPUT_POST, 'pronamic_pay_last_name', FILTER_VALIDATE_EMAIL );

		return $first_name . ' ' . $last_name;
	}

	public function getOwnerAddress() {
		return '';
	}

	public function getOwnerCity() {
		return '';
	}

	public function getOwnerZip() {
		return '';
	}
}
